import json
import time
import uuid
from enum import Enum
from extensions import db

class ProtocolType(str, Enum):
    OIDC = 'OIDC'
    OAUTH2 = 'OAUTH2'
    SAML2 = 'SAML2'
    CAS = 'CAS'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) # In production, this should be hashed!
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.Integer, default=lambda: int(time.time()))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'createdAt': self.created_at
        }

class Provider(db.Model):
    __tablename__ = 'providers'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum(ProtocolType), nullable=False) # Uses Enum type
    logo = db.Column(db.String(255))
    is_enabled = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    config_json = db.Column(db.Text, nullable=False, default='{}') # Stores JSON config string
    created_at = db.Column(db.Integer, default=lambda: int(time.time()))

    @property
    def config(self):
        try:
            return json.loads(self.config_json)
        except:
            return {}

    @config.setter
    def config(self, value):
        self.config_json = json.dumps(value)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type.value if hasattr(self.type, 'value') else self.type,
            'logo': self.logo,
            'isEnabled': self.is_enabled,
            'description': self.description,
            'config': self.config,
            'createdAt': self.created_at
        }
