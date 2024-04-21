import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private fireStore: Firestore, private toastr: ToastrService) {}

  loadData() {
    const itemCollection = collection(this.fireStore, 'subscribers');

    return collectionData(itemCollection, { idField: 'id' });
  }

  deleteData(id: string) {
    const docInstance = doc(this.fireStore, 'subscribers', id);

    deleteDoc(docInstance)
      .then(() => {
        console.log('Document successfully deleted!');
        this.toastr.success('User deleted successfully!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
        this.toastr.error('Error deleting User!');
      });
  }
}
