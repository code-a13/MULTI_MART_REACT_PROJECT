import axios from "axios";

// Enterprise standard: Create an instance so you don't repeat the base URL
export const api = axios.create({
  // We use FakeStore API to simulate a real backend
  baseURL: "https://fakestoreapi.com", 
  headers: {
    "Content-Type": "application/json",
  }
});