import {createClient} from '@supabase/supabase-js'


let input = "Gostaria de encontrar um artigo cientifico sobre desenvolvimento de aplicativos móveis"

console.log(await getArticle(input))

async function getArticle(input) {
    const supabaseUrl = 'https://wzpxaghsqtkwyunzanti.supabase.co'
    const supabaseKey = process.env.SUPA_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey)

    let emb = "http://localhost:11434/api/embeddings";
    let f = await fetch(emb, {
        method: "POST",
        body: JSON.stringify({
            model: "mxbai-embed-large",
            prompt: input
        })
    })

    let v = await f.json()
    let embedding = v.embedding

    const { data: documents } = await supabase.rpc('match_documents', {
        query_embedding: embedding, // Pass the embedding you want to compare
        match_threshold: 0, // Choose an appropriate threshold for your data
        match_count: 10, // Choose the number of matches
    })




    let prompt = `Você trabalha em um banco de dados de artigos cientificos do Instituto Federal de São Paulo. Um usuário está perguntando qual o melhor artigo para ele, de acordo com o PROMPT enviado. Utilizando o RESUMO como contexto do artigo mais similar ao PROMPT, explique brevemente para o usuário sobre este artigo e passe o LINK para o usuário receber mais informações. Seja cauteloso e sempre reforce que este é um artigo cientifico, que não foi gerado por você. 
    PROMPT:'${input}' 
    RESUMO:'${documents[0].resumo}' 
    LINK:'${documents[0].link}'
    `;


    let gemini = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + "";


    let body = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    }


    let f2 = await fetch(gemini, {
        method: "POST",
        body: JSON.stringify(body)
    })

    let v2 = await f2.json()
    // console.log(JSON.stringify(v2))
    let text = v2.candidates[0].content.parts[0].text
    // console.log(text)
    return text;
}