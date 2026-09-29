"""
Describes the Booking/Queue-facing models and the Service being queud/booked for.

"""

from sqlalchemy import Column, String, Integer
from .base import Base

class Service(Base):
    __tablename__ = "services"
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, index=True)
    name = Column(String)
    duration_mins = Column(Integer)

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, index=True)
    branch_id = Column(String, index=True)
    service_id = Column(String, index=True)
    customer_name = Column(String)
    status = Column(String) # booked, called, done
