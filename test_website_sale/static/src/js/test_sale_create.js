odoo.define('test_website_sale.PortalSaleCreate', function (require) {
    'use strict';
        
    var publicWidget = require('web.public.widget');
    var rpc = require('web.rpc');
    
        
    publicWidget.registry.PortalSaleCreate = publicWidget.Widget.extend({
        selector: '.o_portal_nypl_sale_create',
        events: {
            'change select[name="partner_id"]': '_onPartnerChange',
        },
        
        /**
         * @override
         */
        start: function () {
            var def = this._super.apply(this, arguments);
            this.$price_list = this.$('select[name="pricelist_id"]');
            this.$pricelistOptions = this.$price_list.find('option');
            this._changepricelist();
            return def;
        },
        
            //--------------------------------------------------------------------------
            // Private
            //--------------------------------------------------------------------------
        
            /**
             * @private
             */
             _changepricelist: function () {
                var $partner = this.$('select[name="partner_id"]');
                var partnerID = ($partner.val() || 0);
                var selected_option = $partner.find('option').filter('[value="'+partnerID+'"]')
                var partner_price_list = selected_option[0].attributes["property_product_pricelist"].value
                this.$pricelistOptions.detach();
                var $displayedpricelist = this.$pricelistOptions.filter('[value="'+partner_price_list+'"]');
                var nb = $displayedpricelist.appendTo(this.$price_list).show().length;
                this.$price_list.parent().toggle(nb >= 1);
            },
        
            //--------------------------------------------------------------------------
            // Handlers
            //--------------------------------------------------------------------------
        
            /**
             * @private
             */
            _onPartnerChange: function () {
                this._changepricelist();
            },
        });
        });
        