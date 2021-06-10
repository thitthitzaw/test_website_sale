odoo.define('test_website_sale.PortalSaleCreate', function (require) {
    'use strict';
        
    var publicWidget = require('web.public.widget');
    var rpc = require('web.rpc');
    var ajax = require('web.ajax');
    
        
    publicWidget.registry.PortalSaleCreate = publicWidget.Widget.extend({
        selector: '.o_portal_nypl_sale_create',
        events: {
            'change select[name="partner_id"]': '_onPartnerChange',
            'change select[name="pricelist_id"]': '_onPricelistChange',
            'click a[name="portal_sale_create_line"]': '_addNewPortalOrderLine'
        },
        
        /**
         * @override
         */
        start: function () {
            console.log("this is from test_sale_create")
            var def = this._super.apply(this, arguments);
            this.$price_list = this.$('select[name="pricelist_id"]');
            this.$pricelistOptions = this.$price_list.find('option');
            this.$product_list = this.$('select[name="product_ids"]');
            this.$productOptions = this.$product_list.find('option');
            // this._changepricelist();
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
                this.$pricelistOptions.detach();

                //get the seletect customer 's sale price list string array
                var portal_price_list = selected_option[0].attributes["portal_pricelists"]
                // check if the selected customer is connected to pricelist
                var portal_price_list_value
                if (portal_price_list == undefined) {
                    portal_price_list_value = []
                } else {
                    portal_price_list_value = eval(portal_price_list.value)
                }
                // filtered pricelist based on customer's sale pricelist id value
                for (let index = 0; index < portal_price_list_value.length; index++) {
                    // append option directly to select tag
                    this.$price_list.append(this.$pricelistOptions.filter('[value="'+portal_price_list_value[index]+'"]'))
                }
                // get newly added options
                var $displayedpricelist = this.$price_list.children()
                
                // add option to nb to toggle the option 
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

            /**
             * @private
             */
            _onPricelistChange: function () {
                var self = this;
                var $pricelist = this.$('select[name="pricelist_id"]');
                var pricelistID = ($pricelist.val() || 0);
                self.$productOptions.detach();
                // testing promise
                var prom = Promise.resolve();
                prom = this._rpc({
                    route: '/my/quotes/create/'+pricelistID,
                }).then(function (result) {
                    self.myValueFromRpc = result;
                });
                Promise.resolve(prom).then(function() {
                    self.myValueFromRpc.forEach(element => {
                        self.$product_list.append(new Option(element['name'],element['id']))
                    });
                    var $displayedproductlist = self.$product_list.children()
                    var nb = $displayedproductlist.appendTo(self.$product_list).show().length;
                    self.$product_list.parent().toggle(nb >= 1);
                });
            },

            /**
             * @private
             */
            _addNewPortalOrderLine: function () {
                console.log("Oops! you click add a product line")
                var tr = document.createElement('tr');
                var total_th_element = $(document.getElementsByTagName('tr')[0]).children()
                for (let index = 0; index < total_th_element.length-1; index++) {
                    var td1 = document.createElement('td');
                    var select1 = document.createElement('select')
                    select1.setAttribute('name','product_id')
                    select1.setAttribute('class','form-control')
                    select1.innerHTML = '<t t-foreach="product_id" t-as="product"><option t-att-value="product.id"><t t-esc="product.name"/></option></t>'
                    td1.appendChild(select1)
                    tr.appendChild(td1);                    
                }
                tr.append($('<td>').append($('<a>')).append($('<i>').addClass('fa fa-trash')));
                $(document.getElementsByTagName('tbody')[0]).append(tr);
            },
        });
        });
        
