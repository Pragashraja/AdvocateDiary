"""add_hearing_updates_table

Revision ID: a09702701dbe
Revises: a894f0248bef
Create Date: 2025-12-28 08:37:28.638957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a09702701dbe'
down_revision = 'a894f0248bef'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('hearing_updates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('case_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('hearing_date', sa.Date(), nullable=False),
    sa.Column('action_taken', sa.Text(), nullable=True),
    sa.Column('court_order', sa.Text(), nullable=True),
    sa.Column('next_hearing_date', sa.Date(), nullable=True),
    sa.Column('action_to_be_taken', sa.Text(), nullable=True),
    sa.Column('calendar_event_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['calendar_event_id'], ['calendar_events.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['case_id'], ['cases.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('hearing_updates')
