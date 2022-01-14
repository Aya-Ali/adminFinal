export interface Sells {
    data:  Sell[];
    links: Links;
    meta:  Meta;
}

export interface Sell {
    id:                                  number;
    business_id:                         string;
    location_id:                         string;
    res_table_id:                        string;
    res_waiter_id:                       null;
    res_order_status:                    null;
    type:                                string;
    sub_type:                            null;
    status:                              string;
    sub_status:                          null;
    is_quotation:                        string;
    payment_status:                      string;
    adjustment_type:                     null;
    contact_id:                          string;
    customer_group_id:                   null;
    invoice_no:                          string;
    ref_no:                              string;
    subscription_no:                     null;
    subscription_repeat_on:              null;
    transaction_date:                    Date;
    total_before_tax:                    string;
    tax_id:                              string;
    tax_amount:                          string;
    discount_type:                       string;
    discount_amount:                     string;
    rp_redeemed:                         string;
    rp_redeemed_amount:                  string;
    shipping_details:                    null;
    shipping_address:                    null;
    shipping_status:                     string;
    delivered_to:                        null | string;
    shipping_charges:                    string;
    shipping_custom_field_1:             null;
    shipping_custom_field_2:             null;
    shipping_custom_field_3:             null;
    shipping_custom_field_4:             null;
    shipping_custom_field_5:             null;
    additional_notes:                    null;
    staff_note:                          null;
    round_off_amount:                    string;
    final_total:                         string;
    expense_category_id:                 null;
    expense_for:                         null;
    commission_agent:                    null;
    document:                            null;
    is_direct_sale:                      string;
    is_suspend:                          string;
    exchange_rate:                       string;
    total_amount_recovered:              null;
    transfer_parent_id:                  null;
    return_parent_id:                    null;
    opening_stock_product_id:            null;
    created_by:                          string;
    sales_order_ids:                     null;
    purchase_order_ids:                  null;
    custom_field_1:                      null;
    custom_field_2:                      null;
    custom_field_3:                      null;
    custom_field_4:                      null;
    essentials_duration:                 string;
    essentials_duration_unit:            null;
    essentials_amount_per_unit_duration: string;
    essentials_allowances:               null;
    essentials_deductions:               null;
    import_batch:                        null;
    import_time:                         null;
    types_of_service_id:                 null;
    packing_charge:                      string;
    packing_charge_type:                 null;
    service_custom_field_1:              null;
    service_custom_field_2:              null;
    service_custom_field_3:              null;
    service_custom_field_4:              null;
    is_created_from_api:                 string;
    rp_earned:                           string;
    order_addresses:                     null;
    is_recurring:                        string;
    recur_interval:                      string;
    recur_interval_type:                 string;
    recur_repetitions:                   string;
    recur_stopped_on:                    null;
    recur_parent_id:                     null;
    invoice_token:                       null;
    pay_term_number:                     null;
    pay_term_type:                       null;
    selling_price_group_id:              null;
    created_at:                          Date;
    updated_at:                          Date;
    sell_lines:                          any[];
    payment_lines:                       any[];
}

export interface SellLine {
    id:                         number;
    transaction_id:             string;
    product_id:                 string;
    variation_id:               string;
    quantity:                   number;
    quantity_returned:          string;
    unit_price_before_discount: string;
    unit_price:                 string;
    line_discount_type:         string;
    line_discount_amount:       string;
    unit_price_inc_tax:         string;
    item_tax:                   string;
    tax_id:                     null;
    discount_id:                null;
    lot_no_line_id:             null;
    sell_line_note:             string;
    so_line_id:                 null;
    so_quantity_invoiced:       string;
    res_service_staff_id:       null;
    res_line_order_status:      null;
    parent_sell_line_id:        null;
    children_type:              string;
    sub_unit_id:                null;
    created_at:                 Date;
    updated_at:                 Date;
}

export interface Links {
    first: string;
    last:  string;
    prev:  null;
    next:  null;
}

export interface Meta {
    current_page: number;
    from:         number;
    last_page:    number;
    path:         string;
    per_page:     string;
    to:           number;
    total:        number;
}
