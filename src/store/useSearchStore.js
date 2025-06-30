import { create } from "zustand";

export const useSearchStore=create((set)=>({
    searchTerm: '',
    setSearchTerm: (term)=>set({searchTerm: term}),
    filteredModules:[],
    setFilteredModules: (modules=>set({filteredModules: modules}))
}));