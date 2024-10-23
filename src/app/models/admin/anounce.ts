export class Anounce {
    title: string =  ""
    subtitle: string | null =  ""
    description: string =  ""
    price: number |  null  =  null
    contact: string = ""
    country: string = ""
    neighborhood:  string | null = null
    is_published: boolean = false
    status: string = ""
    is_forward: boolean = false
    abonnement_id: number | null = null
    category_id: number | null = null
    user_id: number | null = null
    created_at : Date | null = null
    updated_at : Date  | null = null
}
