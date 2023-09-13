
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
 const firebaseConfig = {
  apiKey: "AIzaSyABoOJmWheDTttXM_ZedQj8s-q0j-oq0HY",
  authDomain: "realestate-77edd.firebaseapp.com",
  projectId: "realestate-77edd",
  storageBucket: "realestate-77edd.appspot.com",
  messagingSenderId: "478640599747",
  appId: "1:478640599747:web:7ed4d895b8f571318f2876",
  measurementId: "G-G7T9EBL34Y"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db=getFirestore()
