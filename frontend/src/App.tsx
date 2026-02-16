import { SearchParamsProvider } from './context/SearchParamsContext'
import { BookListSection } from './components/BookListSection'
import { Cart } from './components/Cart'

const App = () => (
  <div className="app">
    <header className="app__header">
      <h1>Resilient Bookstore</h1>
    </header>
    <div className="app__body">
      <SearchParamsProvider>
        <BookListSection />
      </SearchParamsProvider>
      <Cart />
    </div>
  </div>
)

export default App
