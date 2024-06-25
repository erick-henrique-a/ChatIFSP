import React, { useState } from 'react';
import styled from 'styled-components';
import getArticle from './service/Llm';


const Body = styled.div`
  background-color: #EEEEEE; 
  height: 100vh;               
  display: flex;    
`;

const Aside = styled.aside`
  background-color: #686D76;
  color: #EEEEEE;
  width: 16rem;
`;

const Nav = styled.nav`
  padding: 1.5rem; 
`;

const Main = styled.main`
  flex: 1 1 0%;               
  padding: 2rem;  
`;

const Heading = styled.h2`
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ResponseContainer = styled.div`
  height: 16rem;             
  overflow-y: auto;           
  border-width: 1px;         
  border-radius: 0.5rem;     
  padding: 1rem;            
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;          
`;

const Input = styled.input`
  width: 100%;               
  padding: 0.5rem;           
  border-width: 1px;        
  border-radius: 0.5rem;     
`;

const Button = styled.button`
  background-color: #373A40;  
  color: #fff;               
  font-weight: 700;          
  padding: 0.5rem 1rem;      
  border-radius: 0.75rem;   
  margin-left: 0.5rem;       

  &:hover {
    background-color: #686D76;
  }
`;

const UList = styled.ul`
  padding-left: 0;
`
const ListItem = styled.li`
  list-style-type: none;
  a {
    color: #EEEEEE;
    text-decoration: none;
    display: block;
    padding: 0.5rem 1rem;   // py-2 px-4
    &:hover {
      background-color: #e5e7eb; // bg-gray-200
    }
  }
    
`;

function App() {
  const [userInput, setUserInput] = useState(''); // Guarda o estado do input
  const [articleResponse, setArticleResponse] = useState(''); // Mantém a informação do artigo (resposta)

  const handleSubmit = async (event) => {
    event.preventDefault(); // Pra não mandar vazio pelo que eu entendi, ou padrao ou algo semelhante

    try {
      const response = await getArticle(userInput);
      setArticleResponse(response); // Update article response state
    } catch (error) {
      console.error("Erro ao encontrar o artigo:", error);
      // Handle errors appropriately (e.g., display an error message)
    }
  };
  return (
    <Body>
      <Aside>
        <Nav>
          <Heading>CatGPT</Heading>
          <UList>
            <ListItem><a href="#">Prompts</a></ListItem>
            <ListItem><a href="#">Modelos</a></ListItem>
          </UList>
        </Nav>
      </Aside>

      <Main>
        <Heading>Escreva sobre o artigo que deseja procurar</Heading>
        <ResponseContainer>
          {articleResponse} {/* Exibe resposta */}
        </ResponseContainer>

        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Escreva sua mensagem aqui..." 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} // atualiza o estado do input
          />
          <Button type="submit">Enviar</Button>
        </Form>
      </Main>
    </Body>
  );
}

export default App;