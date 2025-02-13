import { useState } from "react";
import BookCard from "./components/bookCard";
import { toast } from "react-toastify";
import EditModal from "./components/EditModal";
function App() {
  const [bookName, setBookName] = useState("");
  const [books, setBooks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookName) {
      toast.warn("please type a book", { autoClose: 2000 });
      return;
    }
    const newBook = {
      id: new Date().getTime(),
      title: bookName,
      date: new Date().toLocaleString(),
      isRead: false,
    };
    //transfer books array to the created books object
    //spread operator onceden eklenenleri muhafaza eder
    setBooks([...books, newBook]);
    // eleman eklenince inputu sifirla
    setBookName("");
    toast.success("Book add", { autoClose: 2500 });
  };
  //Open close modal
  const handleModal = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = (deletingId) => {
    const filtred = books.filter((item) => item.id !== deletingId);
    // olusan diziyi state aktar
    setBooks(filtred);

    //give notification
    toast.error("Book deleted", { autoClose: 2000 });
  };
  // Okundu butonuna basinca calisir
  const handleRead = (book) => {
    //dizinin kopyasini olusturma
    const updatedBook = { ...book, isRead: !books.isRead };
    const cloneBooks = [...books];
    const index = cloneBooks.findIndex((item) => item.id === book.id);
    cloneBooks.splice(index, 1, updatedBook);

    setBooks(cloneBooks);
  };
  const handleEditBook = () => {
    const index = books.findIndex((book) => book.id === editItem.id);
    const cloneBooks = [...books];
    //eski kitabi diziden cikar terine yenisini koy
    cloneBooks.splice(index, 1, editItem);
    //stati guncelle > kopya diziye aktar
    setBooks(cloneBooks);
    //close modal
    setShowEditModal(false);
  };
  return (
    <div>
      {/* Header */}
      <div className="bg-dark text-light px-5 py-2 fs-5 text-center">
        Book Expert
      </div>

      <div className="container border">
        {/* Form */}
        <form onSubmit={handleSubmit} className="d-flex gap-3 mt-4">
          <input
            onChange={(e) => setBookName(e.target.value)}
            value={bookName}
            className="form-control shadow"
            type="text"
          />
          <button className="btn btn-warning shadow">Add</button>
        </form>
        <div className="d-flex flex-column gap-3 py-5">
          {/* eger state icerisi bos ise ekrana yaz */}
          {books.length === 0 && <h4>Kitap eklenmedi </h4>}

          {/* eger state icerisinde eleman varsa onlari listele */}
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              handleModal={handleModal}
              handleRead={handleRead}
              setShowEditModal={setShowEditModal}
              setEditItem={setEditItem}
            />
          ))}
        </div>
      </div>
      {/*Identify the Modal */}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="modal-inner shadow">
            <h5>Want to delete ?</h5>
            <button
              className="btn btn-warning"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                handleDelete(deleteId);
                setShowConfirm(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          setEditItem={setEditItem}
          editItem={editItem}
          handleEditBook={handleEditBook}
        />
      )}
    </div>
  );
}

export default App;
