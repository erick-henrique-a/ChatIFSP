import React, { useState } from 'react';
import styled from 'styled-components';
import getArticle from './service/Llm';
import IFSPLogo from './images/IFSPLogoNoBg.png'
import { Animation, Loader} from './service/animation';
import { marked } from 'marked';

const Body = styled.div`
  background-color: #EEEEEE; 
  height: 100vh;               
  display: flex;    
`;

const Aside = styled.aside`
  background-color: #195128;
  background-image: radial-gradient(ellipse at center, #17882c 1%, #00510f 100%);
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
  height: 23rem;             
  overflow-y: auto;        
  overflow-x: hidden;   
  border-width: 1px;         
  border-radius: 0.5rem;     
  max-width: 100%;
  min-height:70vh;
  padding: 1rem;
  scrollTop =            
`;
const ChatBubbleAI = styled.div`
  word-wrap: break-word;
  margin-bottom: 12px;
  line-height: 24px;
  position: relative;
	padding: 10px 20px;
  border-radius: 25px;
  
  &:before, &:after {
    content: "";
		position: absolute;
    bottom: 0;
    height: 25px;
  }
    
  background: #2f9e41;
	color: black;
  align-self: flex-start;
	color: #EEEEEE; 
	&:before {
		left: -7px;
    width: 20px;
    background-color: #2f9e41;
		border-bottom-right-radius: 16px;
	}

	&:after {
		left: -26px;
    width: 26px;
    background-color: #EEEEEE;
		border-bottom-right-radius: 10px;
	}
     a {
    text-decoration: none;
    color:  !important;
    }
`
const ChatBubbleUser = styled.p`

  word-wrap: break-word;
  margin-bottom: 12px;
  line-height: 24px;
  position: relative;
	padding: 10px 20px;
  border-radius: 25px;
  
  &:before, &:after {
    content: "";
		position: absolute;
    bottom: 0;
    height: 25px;
  }
  color: black; 
	background: #E5E5EA;
	align-self: flex-end;
		
	&:before {
		right: -7px;
    width: 20px;
    background-color: #E5E5EA;
		border-bottom-left-radius: 16px 14px;
	}

	&:after {
		right: -26px;
    width: 26px;
    background-color: #EEEEEE;
		border-bottom-left-radius: 10px;
	}
`
const Form = styled.form`
  
  display: flex;          
`;

const Input = styled.input`
  width: 100%;               
  padding: 0.5rem;           
  border-width: 1px;        
  border-radius: 0.5rem;     
`;

const Button = styled.button`
  background-color: #cd191e;  
  color: #fff;               
  font-weight: 700;          
  padding: 0.5rem 1rem;      
  border-radius: 0.75rem;   
  margin-left: 0.5rem;       

  &:hover {
    background-color: red;
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
      background-color: green;
    }
  }
    
`;

function App() {
  const [userInput, setUserInput] = useState('');
  const [articleResponse, setArticleResponse] = useState('');
  const [messages, setMessages] = useState([]); // Array to store messages

  const renderHtml = (html) => {
    return { __html: html };
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return; // Don't submit if input is empty
    try {
       // Add AI response
      let input = userInput;
      setUserInput(''); // Clear input after submission
      setMessages(prevMessages => [...prevMessages, { text: userInput, sender: 'user' }]); // Add user message
      setMessages(prevMessages => [...prevMessages, { text: '', sender: 'loader' }]);
      const response = await getArticle(input);
      setMessages(prevMessages => [...prevMessages.filter((elemento) => elemento.sender != 'loader'), { text: response, sender: 'ai' }]); // Add AI response
      
    } catch (error) {
      console.error("Error fetching article:", error);
      // Handle errors (e.g., show error message to the user)
    } finally{

    }
  };
  return (
    <Body>
      <Aside>
        <Nav>
          <Heading><img class="img-fluid" src={IFSPLogo}></img></Heading>
          <UList>
            <ListItem><a href="#">Prompts</a></ListItem>
            <ListItem><a href="http://localhost:3000">Nova conversa</a></ListItem>
          </UList>
        </Nav>
      </Aside>

      <Main>
        <Heading>Escreva sobre o artigo que deseja procurar</Heading>
        <ResponseContainer>
          {messages.map((message, index) => (
            message.sender === 'user' ? (
              <ChatBubbleUser key={index}>{message.text}</ChatBubbleUser>
            ) : message.sender == 'ai'? (
              <ChatBubbleAI key={index} dangerouslySetInnerHTML={renderHtml(marked(message.text))}></ChatBubbleAI>
            ) :(<ChatBubbleAI> <Loader/> </ChatBubbleAI>)
          ))}
        </ResponseContainer>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Escreva sua mensagem aqui..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button type="submit">Enviar</Button>
        </Form>
      </Main>
    </Body>
  );
}

export default App;