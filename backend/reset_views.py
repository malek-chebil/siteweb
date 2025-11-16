#!/usr/bin/env python3
"""
Script pour réinitialiser toutes les vues des listings à 0.
Usage: python reset_views.py
"""
import asyncio
import sys
import os

# Ajouter le répertoire parent au path pour importer les modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import update
from app.database import async_session_maker
from app.models import Listing

async def reset_all_views():
    """Réinitialiser toutes les vues des listings à 0."""
    async with async_session_maker() as session:
        try:
            # Réinitialiser toutes les vues
            result = await session.execute(
                update(Listing).values(views_count=0)
            )
            await session.commit()
            print(f"✅ {result.rowcount} listings réinitialisés (views_count = 0)")
            return result.rowcount
        except Exception as e:
            await session.rollback()
            print(f"❌ Erreur: {e}")
            raise
        finally:
            await session.close()

async def verify_reset():
    """Vérifier que toutes les vues sont à 0."""
    from sqlalchemy import select, func
    async with async_session_maker() as session:
        try:
            result = await session.execute(
                select(
                    func.count(Listing.id).label("total"),
                    func.sum(Listing.views_count).label("total_views"),
                    func.max(Listing.views_count).label("max_views"),
                    func.avg(Listing.views_count).label("avg_views")
                )
            )
            stats = result.first()
            print(f"\n📊 Vérification:")
            print(f"   Total listings: {stats.total}")
            print(f"   Total vues: {stats.total_views or 0}")
            print(f"   Max vues: {stats.max_views or 0}")
            print(f"   Moyenne vues: {stats.avg_views or 0:.2f}")
            
            if stats.total_views == 0:
                print("✅ Toutes les vues sont à 0!")
            else:
                print("⚠️  Certaines vues ne sont pas à 0")
        except Exception as e:
            print(f"❌ Erreur lors de la vérification: {e}")
        finally:
            await session.close()

async def main():
    """Fonction principale."""
    print("🔄 Réinitialisation de toutes les vues des listings...")
    print("")
    
    try:
        count = await reset_all_views()
        await verify_reset()
        print(f"\n✅ Réinitialisation terminée avec succès!")
        return 0
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

