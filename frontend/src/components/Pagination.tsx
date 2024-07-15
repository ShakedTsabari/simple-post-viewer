import { useContext } from "react";
import { ThemeContext } from "./NoteList";

export default function Pagination({ activePage, onPageChange, totalPages, paginationRange }: { activePage: number, onPageChange: (page: number) => void, totalPages: number, paginationRange: number[] }) {
    const theme = useContext(ThemeContext);
    const className = 'pagination-' + theme;
    
    return (
        <div className={className}>
            <button name="first" onClick={() => onPageChange(1)}>
                First
            </button>
            <button name="previous" onClick={() => onPageChange(activePage - 1)}>
                Previous
            </button>
            {paginationRange.map((page) => (
                <button key={page} name={'page-' + page} style={{ fontWeight: page === activePage ? 'bold' : 'normal' }}  onClick={() => onPageChange(page)}>
                    {page}
                </button>
            ))}
            <button name="next" onClick={() => onPageChange(activePage + 1)}>
                Next
            </button>
            <button name="last" onClick={() => onPageChange(totalPages)}>
                Last
            </button>
        </div>
    );
}
