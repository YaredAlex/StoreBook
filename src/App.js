import logo from './logo.svg';
import './App.css';
import "./config"
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getFirestore } from "firebase/firestore";
import swal from 'sweetalert'
function App() {
  const db = getFirestore();
  const [show, setShow] = useState(false)
  const [file, setFile] = useState("");
  const [upfailed, setUpfailed] = useState(false)
  const [fileUrl, setFileurl] = useState("")
  const [bname, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [uploadPercent, setUploadPercent] = useState("");
  const [imagefile, setImgfile] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const uploadFile = async () => {
    const isChecked = await checkInput();
    if (isChecked) {
      // const storage = getStorage();
      // const storageRef = ref(storage, 'some-child');
      // uploadBytes(storageRef, file).then((snapshot) => {
      //   console.log('Uploaded a blob or file!');
      //   console.log("snapshot", spanshot)
      //   fileUrl = snapshot.ref.getDownloadURL();

      // });
      setShow(true)
      const storage = getStorage();
      try {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFileurl(downloadURL);
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
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
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
        fileUrl: fileUrl,
        imageUrl: imageUrl
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
      alert("please fill the fields !!");
      return false;
    }
    if (file === null || file === "") {
      alert("please select file!!!")
      return false
    }
    if (imagefile === "") {
      alert("please select Image")
      return false;
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
          Modal</div>}

      <h1>Online Book store</h1>
      <h2>Upload pdf to the cloud store </h2>
      <form>
        <fieldset>
          <legend>Fill the following</legend>
          <input placeholder='Name of Book' type='text' required onChange={(e) => setName(e.target.value)} value={bname} />
          <input placeholder='Author of Book' type='text' required value={author} onChange={(e) => setAuthor(e.target.value)} />
          <input placeholder='Rating' type="number" required value={rating} onChange={e => setRating(e.target.value)} />
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
