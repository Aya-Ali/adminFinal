export interface Recipes {
    data:  Recipe[];
    links: Links;
    meta:  Meta;
}

export interface Recipe {
    id:                    number;
    name:                  string;
    business_id:           string;
    type:                  string;
    sub_unit_ids:          null;
    enable_stock:          string;
    alert_quantity:        null | string;
    sku:                   string;
    barcode_type:          string;
    expiry_period:         null | string;
    expiry_period_type:    null | string;
    enable_sr_no:          string;
    weight:                null | string;
    product_custom_field1: string;
    product_custom_field2: string;
    product_custom_field3: null | string;
    product_custom_field4: null | string;
    image:                 null | string;
    product_description:   null | string;
    created_by:            string;
    warranty_id:           null;
    is_inactive:           string;
    not_for_selling:       string;
    image_url:             string;
    product_variations:    ProductVariation[];
    brand:                 Brand | null;
    unit:                  Unit;
    category:              Category;
    sub_category:          Category | null;
    product_tax:           null;
    product_locations:     ProductLocation[];
}

export interface Brand {
    id:          number;
    business_id: string;
    name:        string;
    description: string;
    created_by:  string;
    deleted_at:  null;
    created_at:  Date;
    updated_at:  Date;
}

export interface Category {
    id:            number;
    name:          string;
    business_id:   string;
    short_code:    null | string;
    parent_id:     string;
    created_by:    string;
    category_type: string;
    description:   null | string;
    slug:          null;
    deleted_at:    null;
    created_at:    Date;
    updated_at:    Date;
}

export interface ProductLocation {
    id:                       number;
    business_id:              string;
    location_id:              string;
    name:                     string;
    landmark:                 null | string;
    country:                  Country;
    state:                    string;
    city:                     City;
    zip_code:                 string;
    invoice_scheme_id:        string;
    invoice_layout_id:        string;
    sale_invoice_layout_id:   string;
    selling_price_group_id:   null;
    print_receipt_on_invoice: string;
    receipt_printer_type:     ReceiptPrinterType;
    printer_id:               null;
    mobile:                   null | string;
    alternate_number:         null | string;
    email:                    null;
    website:                  null | string;
    featured_products:        null;
    is_active:                string;
    default_payment_accounts: string;
    custom_field1:            null;
    custom_field2:            null;
    custom_field3:            null;
    custom_field4:            null;
    deleted_at:               null;
    created_at:               Date;
    updated_at:               Date;
    pivot:                    Pivot;
}

export enum City {
    Cairo = "Cairo",
    Test = "Test",
}

export enum Country {
    Egypt = "Egypt",
    Test = "Test",
}

export interface Pivot {
    product_id:  string;
    location_id: string;
}

export enum ReceiptPrinterType {
    Browser = "browser",
}

export interface ProductVariation {
    id:                    number;
    variation_template_id: null | string;
    name:                  string;
    product_id:            string;
    is_dummy:              string;
    created_at:            Date;
    updated_at:            Date;
    variations:            Variation[];
}

export interface Variation {
    id:                         number;
    name:                       string;
    product_id:                 string;
    sub_sku:                    string;
    product_variation_id:       string;
    variation_value_id:         null | string;
    default_purchase_price:     string;
    dpp_inc_tax:                string;
    profit_percent:             string;
    default_sell_price:         string;
    sell_price_inc_tax:         string;
    created_at:                 Date;
    updated_at:                 Date;
    deleted_at:                 null;
    combo_variations:           any[] | null;
    variation_location_details: VariationLocationDetail[];
    media:                      Media[];
}

export interface Media {
    id:           number;
    business_id:  string;
    file_name:    string;
    description:  null;
    uploaded_by:  string;
    model_type:   string;
    model_id:     string;
    created_at:   Date;
    updated_at:   Date;
    display_name: string;
    display_url:  string;
}

export interface VariationLocationDetail {
    id:                   number;
    product_id:           string;
    product_variation_id: string;
    variation_id:         string;
    location_id:          string;
    qty_available:        string;
    created_at:           Date;
    updated_at:           Date;
}

export interface Unit {
    id:                   number;
    business_id:          string;
    actual_name:          string;
    short_name:           string;
    allow_decimal:        string;
    base_unit_id:         null;
    base_unit_multiplier: null;
    created_by:           string;
    deleted_at:           null;
    created_at:           Date;
    updated_at:           Date;
}

export interface Links {
    first: string;
    last:  null;
    prev:  null;
    next:  null;
}

export interface Meta {
    current_page: number;
    from:         number;
    path:         string;
    per_page:     number;
    to:           number;
}
