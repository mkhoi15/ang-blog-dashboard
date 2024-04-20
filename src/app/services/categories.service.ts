import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private fireStore: Firestore, private toastr: ToastrService) {}

  saveData(data: any) {
    const itemCollection = collection(this.fireStore, 'categories');

    addDoc(itemCollection, data)
      .then((addDoc) => {
        console.log('Document successfully written!', addDoc);
        this.toastr.success('Category added successfully!');
      })
      .catch((err) => {
        console.error('Error writing document: ', err);
        this.toastr.error('Error adding category!');
      });
  }

  loadData() {
    const itemCollection = collection(this.fireStore, 'categories');

    return collectionData(itemCollection, { idField: 'id' });
  }

  updateData(id: string, data: any) {
    const itemCollection = collection(this.fireStore, 'categories');

    const docInstance = doc(itemCollection, id);

    updateDoc(docInstance, data)
      .then(() => {
        console.log('Document successfully updated!');
        this.toastr.success('Category updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        this.toastr.error('Error updating category!');
      });
  }

  deleteData(id: string) {
    const docInstance = doc(this.fireStore, 'categories', id);

    deleteDoc(docInstance)
      .then(() => {
        console.log('Document successfully deleted!');
        this.toastr.success('Category deleted successfully!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
        this.toastr.error('Error deleting category!');
      });
  }
}
