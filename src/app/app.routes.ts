import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { Home } from './home/home';
import { ListProduct } from './list-product/list-product';
import { Tailwind } from './tailwind/tailwind';

export const routes: Routes = [
   
    { path: '', component: Home},
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'product', component: ListProduct },
    { path: 'tailwind', component: Tailwind }
];
