import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  currentItem: any = { genres: [] };
  genresList: string[] = ["Acción", "Comedia", "Drama", "Fantasía", "Ciencia Ficción", "Romance", "Terror", "Animación", "Documental", "Aventura", "Thriller", "Suspenso"];
  searchTerm: string = '';
  sortField: string = 'title';
  selectedFile: File | null = null;
  editItemId: string | null = null;
  showModal: boolean = false; // Propiedad para controlar la visibilidad del modal


  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(
      (items) => {
        this.items = items;
        this.filteredItems = [...this.items]; // Copiamos los elementos para mantener la lista original
        this.sortItems(); // Ordenamos por el campo por defecto
      },
      (error) => {
        console.error('Error al obtener películas:', error);
      }
    );
  }

  getItemById(id: string): void {
    this.itemService.getItemById(id).subscribe(
      (item) => {
        this.currentItem = item;
        this.currentItem.genres = item.genres || [];
        this.openEditModal(id); // Abrir el modal de edición con los datos cargados
      },
      (error) => {
        console.error('Error al obtener película por ID:', error);
        alert('Hubo un error al obtener la película por ID');
      }
    );
  }

  createItem(): void {
    if (!this.currentItem.genres || !Array.isArray(this.currentItem.genres) || this.currentItem.genres.length === 0) {
      alert('El campo "genres" es requerido y debe ser un arreglo con al menos un género.');
      return;
    }

    if (this.selectedFile) {
      this.itemService.createItem(this.currentItem, this.selectedFile).subscribe(
        (response) => {
          this.getItems(); // Refrescamos la lista después de crear
          this.currentItem = { genres: [] }; // Limpiar currentItem después de agregar
          this.selectedFile = null; // Limpiar el archivo seleccionado
          alert('Película agregada correctamente');
        },
        (error) => {
          console.error('Error al agregar película:', error);
          alert('Hubo un error al agregar la película');
        }
      );
    } else {
      alert('Por favor, selecciona un archivo de imagen');
    }
  }

  editItem(id: string): void {
    this.editItemId = id;
    this.getItemById(id); // Cargar los datos del item a editar
  }

  updateItem(): void {
    if (this.currentItem._id) {
      this.itemService.updateItem(this.currentItem._id, this.currentItem, this.selectedFile).subscribe(
        (response) => {
          this.getItems(); // Refrescamos la lista después de actualizar
          this.currentItem = { genres: [] }; // Limpiar currentItem después de actualizar
          this.selectedFile = null; // Limpiar el archivo seleccionado
          alert('Película actualizada correctamente');
        },
        (error) => {
          console.error('Error al actualizar película:', error);
          alert('Hubo un error al actualizar la película');
        }
      );
    } else {
      alert('Por favor, selecciona una película para actualizar');
    }
  }

  deleteItem(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      this.itemService.deleteItem(id).subscribe(
        (response) => {
          this.getItems(); // Refrescamos la lista después de eliminar
          alert('Película eliminada correctamente');
        },
        (error) => {
          console.error('Error al eliminar película:', error);
          alert('Hubo un error al eliminar la película');
        }
      );
    }
  }

  searchItems(): void {
    this.filteredItems = this.items.filter(item =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortItems(): void {
    this.filteredItems.sort((a, b) => {
      if (a[this.sortField] < b[this.sortField]) {
        return -1;
      }
      if (a[this.sortField] > b[this.sortField]) {
        return 1;
      }
      return 0;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Métodos para abrir y cerrar el modal
  openEditModal(id: string): void {
    this.editItemId = id;
    this.showModal = true; // Mostrar el modal
    this.getItemById(id); // Cargar los datos del item a editar
  }

  closeEditModal(): void {
    this.showModal = false; // Ocultar el modal
    this.editItemId = null;
    this.currentItem = { genres: [] }; // Limpiar currentItem si es necesario
  }
}
