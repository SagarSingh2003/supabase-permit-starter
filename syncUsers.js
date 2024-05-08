import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL , import.meta.env.VITE_SUPABASE_KEY)

const token = import.meta.env.VITE_PERMIT_TOKEN;

//getting data of all the users in supabase

const { data: users, error } = await supabase.from("profiles").select("*");

console.log(users);

//adding all the users to permit.io directory

async function syncAllUsers(){
    for(let user of users){
        const res_1 = await fetch("https://api.permit.io/v2/facts/3776945a92ec4f6395e407d9a1feb472/7deb15a74b894f2995ec8cf0ec58c112/tenants/todo-tenant/users" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                key : user.id,
                email : user.email
            })
        })

        const response = await res_1.json();
        console.log(response);
    }
    
    
    
    for(let user of users){
        const res_2 = await fetch("https://api.permit.io/v2/facts/3776945a92ec4f6395e407d9a1feb472/7deb15a74b894f2995ec8cf0ec58c112/role_assignments" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                user : user.id,
                tenant: "todo-tenant",
                role: "Employee"
            })
        })
    
        const response = await res_2.json();
        console.log(response);
    
    }
}


syncAllUsers();
