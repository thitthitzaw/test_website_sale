import binascii
from datetime import date

from odoo import fields, http, _
from odoo.exceptions import AccessError, MissingError
from odoo.http import request
from odoo.addons.payment.controllers.portal import PaymentProcessing
from odoo.addons.portal.controllers.mail import _message_post_helper
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager, get_records_pager
from odoo.osv import expression


class CustomerPortal(CustomerPortal):

    @http.route('/my/quotes/create', type='http', auth="user", website=True)
    def sale_order_create(self, **post):
        if post.get('pricelist_id'):
            pricelist_id = int(post.get('pricelist_id'))
            partner_id =int(post.get('partner_id'))
            request.env['sale.order'].sudo().create({
                'partner_id': partner_id,
                'partner_invoice_id': 1,
                'partner_shipping_id': 1,
                'pricelist_id': pricelist_id,
            })
            return request.redirect('/my/quotes/create?submitted=1')

        return request.render('test_website_sale.test_order_create_form', {
            'pricelists':request.env['product.pricelist'].search([]),
            'partner_ids':request.env['res.partner'].search([]),
            'order_lines':request.env['sale.order.line'].search([]),
            'submitted': post.get('submitted', False)
        })