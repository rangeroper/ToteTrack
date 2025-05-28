import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";

import CreateTote from "./pages/CreateTote";
import EditTote from "./pages/EditTote";

import ToteList from "./components/ToteList";
import ToteDetail from "./components/ToteDetail";

import NotFoundPage from "./pages/NotFoundPage";
import TagsManager from "./components/TagsManager";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/totes" element={<ToteList />} />
        <Route path="/totes/:id" element={<ToteDetail />} />
        <Route path="/totes/:id/edit/" element={<EditTote />} />
        <Route path="/create" element={<CreateTote />} />
        <Route path="/tags" element={<TagsManager />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
