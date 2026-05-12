'use client';

import { useState, useEffect } from 'react';
import { searchService } from '@/lib/search-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await searchService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.length > 2) {
        try {
          const sugg = await searchService.getSuggestions(query);
          setSuggestions(sugg);
        } catch (error) {
          console.error('Error loading suggestions:', error);
        }
      }
    };

    const timer = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const searchResults = await searchService.searchAdvanced({
        query,
        category: selectedCategory,
        difficulty,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      setResults(searchResults || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D2545] to-[#1a3a5c]">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-8">Recherche Avancée</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Rechercher une formation, un cours..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 py-3 text-lg"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-b-lg mt-1 shadow-lg z-10">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0D2545] mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0D2545] mb-2">
                  Niveau
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Tous niveaux</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0D2545] mb-2">
                  Prix Min (XOF)
                </label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0D2545] mb-2">
                  Prix Max (XOF)
                </label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="999999"
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-[#0D2545] hover:bg-[#0a1d2e] text-white flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Rechercher
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="text-white text-center">Recherche en cours...</div>
        ) : (
          <>
            <p className="text-white mb-6">
              {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
            </p>

            <div className="grid gap-6">
              {results.map((formation) => (
                <Card key={formation.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0D2545] mb-2">
                        {formation.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{formation.short_description}</p>
                      <div className="flex gap-3 flex-wrap mb-4">
                        {formation.category && (
                          <span className="bg-[#C9A227] text-[#0D2545] px-3 py-1 rounded-full text-sm font-bold">
                            {formation.category}
                          </span>
                        )}
                        {formation.level && (
                          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {formation.level}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#C9A227] mb-4">
                        {formation.price.toLocaleString()} XOF
                      </div>
                      <Link href={`/courses/${formation.slug}`}>
                        <Button className="bg-[#0D2545] hover:bg-[#0a1d2e] text-white">
                          Voir la formation
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
