
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Lidar com requisições CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verificar autenticação
  try {
    const { texto, origem, nomeArquivo } = await req.json();

    if (!texto || !origem) {
      return new Response(
        JSON.stringify({ error: 'Texto e origem são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar prompt para a IA
    const prompt = `
    Você é um assistente especializado em criar flashcards para estudo.
    Com base no texto fornecido, crie um conjunto de pares de perguntas e respostas.
    
    Siga estas regras:
    1. Extraia os conceitos-chave e informações importantes
    2. Crie perguntas diretas que testem o conhecimento
    3. Forneça respostas precisas e concisas
    4. Focalize as informações mais relevantes para memorização
    5. Use linguagem clara e objetiva
    6. Crie entre 5 e 15 flashcards, dependendo da quantidade de conteúdo
    7. Retorne APENAS EM JSON, com um array de objetos, cada um contendo "pergunta" e "resposta"
    
    Aqui está o texto:
    ${texto.substring(0, 10000)} // Limitando para evitar tokens excessivos
    
    Responda APENAS com o JSON sem comentários adicionais.
    Formato: [{"pergunta": "Pergunta 1?", "resposta": "Resposta 1"}, ...]
    `;

    // Chamar a API da OpenAI
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'API key da OpenAI não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em criar flashcards para estudo.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (openAIData.error) {
      console.error('Erro na chamada da OpenAI:', openAIData.error);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar com a IA: ' + openAIData.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extrair a resposta da OpenAI
    const aiResponse = openAIData.choices[0].message.content;
    
    // Processar a resposta JSON
    let flashcards;
    try {
      // Remover possíveis marcadores de código e espaços em branco
      const cleanedResponse = aiResponse.replace(/```json|```/g, '').trim();
      flashcards = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Erro ao processar resposta JSON:', error);
      console.log('Resposta recebida:', aiResponse);
      return new Response(
        JSON.stringify({ error: 'Formato de resposta inválido da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ flashcards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função gerar-flashcards:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
