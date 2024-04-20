import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor(
    private fireStore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImage: any,
    postData: any,
    formStatus: string,
    id: string
  ) {
    const filePath = `postIMG/${Date.now()}`;
    const storageRef = ref(this.storage, filePath);
    uploadBytesResumable(storageRef, selectedImage)
      .then((snapshot) => {
        // After upload is complete, get the download URL
        getDownloadURL(snapshot.ref)
          .then((downloadURL) => {
            postData.postImgPath = downloadURL;
            // You can use downloadURL here or return it for further processing
            if (formStatus === 'Edit Post') {
              this.updateData(id, postData);
              return;
            }
            this.saveData(postData);
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }

  saveData(data: any) {
    const itemCollection = collection(this.fireStore, 'posts');

    addDoc(itemCollection, data)
      .then((addDoc) => {
        this.toastr.success('Post added successfully!');
        this.router.navigate(['/posts']);
      })
      .catch((err) => {
        console.error('Error writing document: ', err);
        this.toastr.error('Error adding post!');
      });
  }

  loadData() {
    const itemCollection = collection(this.fireStore, 'posts');

    return collectionData(itemCollection, { idField: 'id' });
  }

  loadSinglePost(id: string): Observable<any> {
    const postDocRef = doc(this.fireStore, 'posts', id);
    return new Observable((observer) => {
      getDoc(postDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            observer.next({ id: docSnapshot.id, ...docSnapshot.data() });
          } else {
            observer.error(new Error(`Post with id ${id} does not exist`));
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  updateData(id: string, postData: any) {
    const postDocRef = doc(this.fireStore, 'posts', id);

    updateDoc(postDocRef, postData)
      .then(() => {
        this.toastr.success('Post updated successfully!');
        this.router.navigate(['/posts']);
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        this.toastr.error('Error updating post!');
      });
  }

  deleteImage(imagePath: string): Promise<void> {
    const storageRef = ref(this.storage, imagePath);

    // Delete the file
    return deleteObject(storageRef)
      .then(() => {
        console.log('File deleted successfully');
        // You can perform additional actions if needed after successful deletion
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
        throw error; // Re-throw the error for handling in the calling function
      });
  }

  deletePost(id: string, imagePath: string): void {
    const postDocRef = doc(this.fireStore, 'posts', id);

    deleteDoc(postDocRef)
      .then(() => {
        this.deleteImage(imagePath)
          .then(() => {
            this.toastr.success('Post deleted successfully!');
          })
          .catch((error) => {
            console.error('Error deleting post image:', error);
          });
      })
      .catch((error) => {
        this.toastr.error('Error deleting post!');
      });
  }

  markFeatured(id: string, isFeatured: boolean): void {
    const postDocRef = doc(this.fireStore, 'posts', id);

    updateDoc(postDocRef, { isFeatured: isFeatured })
      .then(() => {
        this.toastr.info('Post updated successfully!');
      })
      .catch((error) => {
        this.toastr.error('Error updating post!');
      });
  }
}
