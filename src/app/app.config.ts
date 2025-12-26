import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Lucide icons
import {
  LucideAngularModule,
  Home,
  Box,
  Users,
  Bell,
  MessageCircle,
  User,
  Truck,
  Ticket,
  Layers,
  Building,
  Menu,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  PlusCircle,
  Percent,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Download,
  FileSpreadsheet,
  UploadCloud,
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle2,
  Wrench,
  BadgeDollarSign,
  List,
  Search,
  ChevronRight,
  Phone,
  CheckCheck,
  ShieldCheck,
  Tag,
  Package,
  Filter,
  Flame,
  ChevronLeft,
  Circle,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Trash,
  RefreshCw,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  Layers2,
  Save,
  Tags,
  EyeOff,
  Wallet,
  StickyNote,
  Copy,
  NotepadText
} from 'lucide-angular';

// ✅ Import thêm 2 dòng này:
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        newestOnTop: true,
        preventDuplicates: true,
      })
    ),

    // Giữ nguyên phần Lucide
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        Box,
        Users,
        Bell,
        LogOut,
        RefreshCw,
        MessageCircle,
        User,
        Truck,
        Ticket,
        Layers,
        Building,
        Menu,
        Plus,
        Eye,
        Edit,
        Trash2,
        X,
        PlusCircle,
        Percent,
        ChevronDown,
        ChevronUp,
        LayoutDashboard,
        Download,
        FileSpreadsheet,
        UploadCloud,
        ArrowLeft,
        ShoppingCart,
        MapPin,
        Facebook,
        Instagram,
        Twitter,
        CheckCircle2,
        Wrench,
        BadgeDollarSign,
        List,
        Search,
        ChevronRight,
        Phone,
        CheckCheck,
        ShieldCheck,
        Tag,
        Package,
        Filter,
        Flame,
        ChevronLeft,
        Circle,
        ShoppingBag,
        DollarSign,
        TrendingUp,
        Trash,
        ChevronsLeft,
        ChevronsRight,
        CheckCircle,
        Layers2,
        Save,
        Tags,
        EyeOff,
        Wallet,
        StickyNote,
        Copy,
        NotepadText
      })
    ), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(),
  ]
};
