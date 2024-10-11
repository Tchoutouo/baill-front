export interface Anounce {
    title: string,
    subtitle: string | null,
    description: string,
    price: number,
    contact: string
    country: string,
    neighborhood:  string | null,
    is_published: boolean,
    status: string,
    is_forward: boolean,
    abonnement_id: number ,
    category_id: number,
    user_id: number,
    created_at : Date | null,
    updated_at : Date  | null,
}
