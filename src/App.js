import logo from './logo.svg';
import './App.css';
import "./config"
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRef, useState } from 'react';
import { doc, setDoc, collection, addDoc, getFirestore } from "firebase/firestore";
import swal from 'sweetalert'
function App() {
  const db = getFirestore();
  const [show, setShow] = useState(false)
  const [file, setFile] = useState("");
  const [upfailed, setUpfailed] = useState(false)
  const fileUrl = useRef("")
  const [bname, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [uploadPercent, setUploadPercent] = useState("");
  const [imagefile, setImgfile] = useState("");
  const imageUrl = useRef("")
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const uploadFile = async () => {
    const isChecked = await checkInput();
    if (isChecked) {
      setShow(true)
      const storage = getStorage();
      try {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPercent(progress)
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            swal("Error", "file is not uploaded", "error")
            setUpfailed(true)

          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fileUrl.current = downloadURL;
              // uploadToFireBase();
              uploadImage();
            });
          }
        );
      } catch (e) {
        swal("Error", "Can't upload file to cloud see console", "error")
        setUpfailed(true)
        console.log(e)
        setShow(false)
      }
      ////uploading data

    }
  }
  const uploadImage = async () => {
    setShow(true)
    const storage = getStorage();
    try {
      const storageRef = ref(storage, imagefile.name);
      const uploadTask = uploadBytesResumable(storageRef, imagefile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercent(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is Image running');
              break;
          }
        },
        (error) => {
          swal("Error", "Image is not uploaded", "error")
          setUpfailed(true)

        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            imageUrl.current = downloadURL
            console.log("fileUrl is", fileUrl, "image url is", imageUrl)
            uploadToFireBase();
            setShow(false)
          });
        }
      );
    } catch (e) {
      swal("Error", "Can't upload Image to cloud see console", "error")
      setUpfailed(true)
      console.log(e)
      setShow(false)
    }
  }
  const uploadToFireBase = async () => {
    if (!upfailed) {
      const docRef = await addDoc(collection(db, "books"), {
        name: bname,
        author: author,
        rating: rating,
        fileUrl: fileUrl.current,
        imageUrl: imageUrl.current,
        description: description,
        category: category
      }).then(res => {
        console.log("uploaded", res)
        swal("Uploaded", "file uploaded successfully", "success");
      });
      //reset input
      setAuthor("")
      setName("")
      setRating("")
      setFile("")
      setImgfile("")
      setDescription("")
      setCategory("")
    }
  }
  const checkInput = async () => {
    // const r = await swal({
    //   title: "Are you sure?",
    //   text: "Are you sure to Upload it?",
    //   icon: "info",
    //   dangerMode: true,
    // })
    console.log(bname, author, rating)
    if (bname.length < 3 || author.length < 3 || rating === "") {
      alert("please fill the fields !! filed should be greather than 3 characters");
      return false;
    }
    else if (category === "") {
      alert("please select category")
      return false
    }
    else if (file === null || file === "") {
      alert("please select file!!!")
      return false
    }
    else if (imagefile === "") {
      alert("please select Image")
      return false;
    }
    if (description.length < 10) {
      alert("please description is required at least 10 characters")
    }
    return true;
  }
  const onchange = (event) => {
    setFile(event.target.files[0])
  }
  const handleImge = (event) => {
    setImgfile(event.target.files[0])
  }

  return (
    <div className='app'>
      {show &&
        <div className='modal'>
          <div className='message'>
            <p>{Math.floor(uploadPercent)}% is finished uploading</p>
          </div>
        </div>}

      <h1>Online Book store</h1>
      <h2>Upload pdf to the cloud store </h2>
      <form>
        <fieldset>
          <legend>Fill the following</legend>
          <select name='category' onChange={e => setCategory(e.target.value)} id="category">
            <option value="">Please Select</option>
            <option value="Fiction" >Fictional</option>
            <option value="Non-Fiction">Non-fiction</option>
            <option value="EducationalReference">EducationalReference</option>
            <option value="BioGraphy">BioGraphy</option>
            <option value="Economics">Economics</option>
          </select>
          <input placeholder='Name of Book' type='text' required onChange={(e) => setName(e.target.value)} value={bname} />
          <input placeholder='Author of Book' type='text' required value={author} onChange={(e) => setAuthor(e.target.value)} />
          <input placeholder='Rating' type="number" max="5" min="0" required value={rating} onChange={e => setRating(e.target.value)} />
          <input placeholder='description' type="text" value={description} onChange={e => setDescription(e.target.value)} />
        </fieldset>
      </form>
      <p>Choose pdf file</p>
      <input type="file" accept='application/pdf' id='file' onChange={onchange} required />
      <p>Choose image of Book</p>
      <input type="file" accept="image/*" id="img" onChange={handleImge} />
      <img alt='book image' src={imagefile ? URL.createObjectURL(imagefile) : ""} width="100px" height="100px"
        style={{ objectFit: "cover" }} />
      <button onClick={uploadFile}>upload</button>
    </div>
  );
}

export default App;
