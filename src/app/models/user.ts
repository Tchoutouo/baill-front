export interface User {
    profil_code?: string ;
    id?: number,
    username: string,
    first_name?: string,
    last_name?: string,
    email: string,
    email_verified_at?: string,
    password: string,
    picture?: string,
    number?: string,
    whatsapp_number?: string,
    site_url?: string,
    neighborhood?: string,
    city?: string,
    country?: string,
    date_of_birth?: string,
    place_of_birth?: string,
    sex?: boolean,
    passwordConfirm?: string,
    cni?: string,
    nbre_publisher?: number,
    nbre_expired?: number
}
