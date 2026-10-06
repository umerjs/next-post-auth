"use client";

import { create } from "zustand";

export interface User {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  profileimg?: string;
}

interface StoreState {
  user: User | null;
  isLogin: boolean | null;

  login: (user: User) => void;
  logout: () => void;
}

export const store = create<StoreState>((set) => ({
  user: null,
  isLogin: null,

  login: (user) => {
    set({
      user,
      isLogin: true,
    });
  },

  logout: () => {
    set({
      user: null,
      isLogin: false,
    });
  },
}));
