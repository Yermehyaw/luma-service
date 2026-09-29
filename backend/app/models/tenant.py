from sqlalchemy import Column, String
from .base import Base

class Business(Base):
    __tablename__ = "businesses"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    short = Column(String)
    type = Column(String) # bank, school, civic
    subdomain = Column(String, unique=True, index=True)

class Branch(Base):
    __tablename__ = "branches"
    id = Column(String, primary_key=True, index=True)
    business_id = Column(String, index=True)
    name = Column(String)
    code = Column(String)
    address = Column(String)
