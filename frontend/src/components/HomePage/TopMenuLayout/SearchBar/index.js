import styles from './searchbar.module.css'
import searchIcon from './search-outline.svg'

const SearchBar = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type='text'
                className={styles.input}
            />
            <input
                type='text'
                className={styles.input}
            />
            <button className={styles.submitButton} type='submit'><img src={searchIcon} alt='search' /></button>
        </form>
    )
}

export default SearchBar
