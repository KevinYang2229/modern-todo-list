import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            我的任務清單
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            保持專注，完成目標
          </p>
        </div>
        
        <form onSubmit={addTodo} className="mt-8 flex items-center gap-3">
          <input
            type="text"
            required
            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ease-in-out"
            placeholder="新增待辦事項..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-md"
          >
            新增任務
          </button>
        </form>

        {/* 分類頁籤 */}
        <div className="flex p-1 bg-gray-100 rounded-xl mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            全部 ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              filter === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            進行中 ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              filter === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            已完成 ({todos.filter(t => t.completed).length})
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-gray-400 text-sm italic">
                {filter === 'all' ? '目前沒有任何任務' : filter === 'active' ? '沒有進行中的任務' : '沒有已完成的任務'}
              </span>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                  todo.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-lg transition-all duration-300 ${
                    todo.completed ? 'line-through text-gray-400 font-normal' : 'text-gray-700 font-medium'
                  }`}>
                    {todo.text}
                  </span>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="pt-4 mt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 uppercase tracking-wider">
            <span>{todos.filter(t => !t.completed).length} 個未完成</span>
            <button 
              onClick={() => setTodos(todos.filter(t => !t.completed))}
              className="hover:text-red-400 transition-colors"
            >
              清除所有已完成
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-white/70 text-sm">
        Built with Vite + React + Tailwind CSS
      </footer>
    </div>
  )
}

export default App
