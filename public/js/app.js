const auth = firebase.auth(); 
const db = firebase.firestore();

//Pages
const LoginPage = document.getElementById("LoginPage");
const ToDoList = document.getElementById("ToDoList");
const EditPage = document.getElementById("EditPage");
const UsersName = document.getElementById("UsersName");

//Messgaes
const ErrorMessage = document.getElementById("ErrorMessage");

//Buttons
const SignInBtn = document.getElementById("SignInBtn");
const SignOutBtn = document.getElementById("SignOutBtn");
const UpdateBtn = document.getElementById("UpdateBtn");
const AddBtn = document.getElementById("AddBtn");

//User Details
const UserName = document.getElementById("UserName");

//Auth
const provider = new firebase.auth.GoogleAuthProvider();

//Database Const
const list = document.getElementById("list");
const AddContent = document.getElementById("AddContent");
const UpdateContent = document.getElementById("textbox");
let listRef;
let unsubscribe;
let Fillform;


//SignIn & SignOut functions
SignInBtn.onclick = () => auth.signInWithPopup(provider);
SignOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user =>{
    
    if(user){
        LoginPage.hidden = true;
        ToDoList.hidden = false;
        SignOutBtn.hidden = false;
        SignInBtn.hidden = true;
        UsersName.innerHTML =`${user.displayName}'s List`;
    }
    
    else{
        LoginPage.hidden = false;
        ToDoList.hidden = true;
        SignInBtn.hidden = false;
        SignOutBtn.hidden = true;
        UsersName.innerHTML ="Welcome";
    }
}); // to detect the changes in the user auth throughout the UI


//Task Function
auth.onAuthStateChanged(user =>{
    
    if(user){
        
        
        listRef =db.collection("list");
        
        //Adding Task
        AddBtn.onclick = () =>{
            
            const {serverTimestamp} = firebase.firestore.FieldValue;
            
            if(AddContent.value !==""){
            listRef.add({ //creates a new document
                uid: user.uid,
                name: AddContent.value,
                createdAt: serverTimestamp()
            })
            
             .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                AddContent.value= "";
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
            
        } 
    }
        
//        UpdateBtn.onclick = (e) =>{
//            
//            console.log(e.target.parentElement);
//           
//        }
        unsubscribe = listRef
            .where("uid","==",user.uid)
            .orderBy("createdAt")
            .onSnapshot(querySnapshot =>{
                const items = querySnapshot.docs.map(doc =>{

                    return `<li data-id="${doc.id}">


                                <p>${doc.data().name}</p>

                                <div class="listbutton">
                                <button class="Button edit" id="EditBtn" onclick="GoToUpdatePage('${doc.id}');">Edit</button>
                                <button class="Button delete" id="DeleteBtn" onclick="DeleteTask('${doc.id}');">Delete</button>
                                </div>

                            </li>`
                });
            list.innerHTML = items.join('');
    });
        
    
    
        
    
        
    } else{
        unsubscribe && unsubscribe();
    }
            
    
    
});


function GoToUpdatePage(id){
    
    
    
    
    
//    console.log(CurrentDocument);
    ToDoList.hidden= true;
    EditPage.hidden= false;
    
    
    
    UpdateBtn.onclick = (e) =>{
            
            console.log(id);
            const CurrentDocument = db.collection("list").doc(id);
            
        return CurrentDocument.update({
            
            name: textbox.value
        })
        
        .then(function() {
                console.log("Document updated with ID: ");
                ToDoList.hidden= false;
                EditPage.hidden= true;
                ErrorMessage.innerHTML="";
//                textbox.value = "";
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                ErrorMessage.innerHTML ="Failed to Update";
            });
           
        }

}

function DeleteTask(id){
    
    db.collection("list").doc(id).delete()
    
    .then(function() {
                console.log("Document Deleted with ID: ");
                
            })
            .catch(function(error) {
                console.error("Error deleting document: ", error);
                
            });
           
        
}
function BackToList(){
    
    
    ToDoList.hidden= false;
    EditPage.hidden= true;

}

