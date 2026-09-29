"""
A pydantic model for handling queue/booking ticket creation and response validation to and from the db
"""
from pydantic import BaseModel
from typing import Optional

class TicketCreate(BaseModel):
    business_id: str
    branch_id: str
    service_id: str
    customer_name: str
    customer_email: Optional[str] = None  # Will be become required soon

class TicketResponse(TicketCreate):
    id: str
    status: str

    class Config:
        from_attributes = True # updated from orm_mode for Pydantic V2
