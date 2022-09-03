# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError


class Partner(models.Model):
    
    _inherit = "res.partner"

    portal_pricelists = fields.Many2many('product.pricelist', string='Sale Pricelist')

# testing
# testing 2