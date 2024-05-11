import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Register } from './Register';
import { LoginPage } from './Login';
import { QuestionsList } from './QuestionsList';
import { UserProfile } from './UserProfile';
import { AskQuestion } from './AskQuestion';
import SearchList from './SearchList';
import TagFilterList from './TagFilterList';
import QuestionDetails from './QuestionDetails';
import AnswerQuestion from './AnswerQuestion';
import TagEdit from './TagEdit';
import EditQuestion from './EditQuestion';
import EditAnswer from './EditAnswer';
import { TagsList } from './TagsList';
import { WelcomePage } from './WelcomePage';

// Changed to function based from class based
// Because I want to have a react navigate hook

const FakeStackOverflow = () => {
  return (
    <BrowserRouter>
      <FakeStackOverflowRoutes />    
    </BrowserRouter>
  )
}

const FakeStackOverflowRoutes = () => {
  const navigate = useNavigate()
  return (
    <Routes>
      <Route exact path="/" element={<WelcomePage navigate={navigate}/>} />
      <Route path="welcome" element={<WelcomePage navigate={navigate}/>} />
      <Route path="register" element={<Register navigate={navigate}/>} />
      <Route path="login" element={<LoginPage navigate={navigate}/>} />
      <Route path="questions" element={<QuestionsList navigate={navigate}/>} />
      <Route path="questions/:id" element={<QuestionDetails navigate={navigate}/>} />
      <Route path="questions/tagged/:query" element={<TagFilterList navigate={navigate}/>} />
      <Route path="search" element={<SearchList navigate={navigate} />} />
      <Route path="search/:query" element={<SearchList navigate={navigate}/>} />
      <Route path="tags" element={<TagsList navigate={navigate}/>} />
      <Route path="questions/ask" element={<AskQuestion navigate={navigate}/>} />
      <Route path="questions/:id/answer" element={<AnswerQuestion navigate={navigate}/>} />
      <Route path="userprofile" element={<UserProfile navigate={navigate}/>}/>
      <Route path="tagedit/:id" element={<TagEdit navigate={navigate}/>} />
      <Route path="editquestion/:id" element={<EditQuestion navigate={navigate} />} />
      <Route path="editanswer/:id" element={<EditAnswer navigate={navigate} />} />
      <Route path="*" element={<div>404 not found.</div>} />
    </Routes>
  )
}

export default FakeStackOverflow