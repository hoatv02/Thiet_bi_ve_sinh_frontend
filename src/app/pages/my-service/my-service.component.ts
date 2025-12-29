import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-my-service',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './my-service.component.html',
})
export class MyServiceComponent {
  categories = [
    'BỒN CẦU',
    'VÒI - CHẬU LAVABO RỬA MẶT',
    'SEN TẮM',
    'BỒN TẮM',
    'BỒN TIỂU',
    'PHỤ KIỆN PHÒNG TẮM',
    'BÌNH NÓNG LẠNH',
    'THIẾT BỊ BẾP',
  ];
  selectedCategory = this.categories[0];

  feeTables: Record<string, { stt: number; name: string; price: string }[]> = {
    'BỒN CẦU': [
      { stt: 1, name: 'Lắp đặt bồn cầu 2 khối (cơ bản) + Xịt', price: '300.000' },
      { stt: 2, name: 'Tháo gỡ bồn cầu 2 khối', price: '100.000' },
      { stt: 3, name: 'Lắp đặt bồn cầu 1 khối (cơ bản) + Xịt', price: '350.000' },
      { stt: 4, name: 'Tháo gỡ cầu 1 khối', price: '100.000' },
      { stt: 5, name: 'Tháo gỡ + Lắp đặt bộ xả bồn cầu', price: '250.000' },
      { stt: 6, name: 'Lắp đặt bồn cầu 2 khối nắp điện tử + Xịt', price: '400.000' },
      { stt: 7, name: 'Lắp đặt bồn cầu 1 khối nắp điện tử + Xịt', price: '450.000' },
      { stt: 8, name: 'Lắp đặt bồn cầu 2 khối nắp rửa cơ + Xịt', price: '350.000' },
      { stt: 9, name: 'Lắp đặt bồn cầu 1 khối nắp rửa cơ + Xịt', price: '400.000' },
      { stt: 10, name: 'Lắp đặt bồn cầu điện tử (bồn cầu Neorest)*', price: '900.000' },
      { stt: 11, name: 'Lắp đặt bồn cầu treo tường (két âm + thân + nút nhấn)', price: '1.200.000' },
      { stt: 12, name: 'Lắp đặt nắp rửa điện tử', price: '250.000' },
      { stt: 13, name: 'Lắp đặt nắp rửa cơ', price: '200.000' },
      { stt: 14, name: 'Lắp đặt nắp nhựa bồn cầu, nắp sứ (thùng nước)', price: '150.000' },
      { stt: 15, name: 'Lắp đặt xịt vệ sinh', price: '100.000' },
      { stt: 16, name: 'Phí môi trường xử lý bồn cầu cũ', price: '150.000' },
      { stt: 17, name: 'Công lắp dây điện nổi dưới 4 mét + Ổ cắm (chưa tính vật tư)', price: '200.000' },
    ],
    'VÒI - CHẬU LAVABO RỬA MẶT': [
      { stt: 1, name: 'Lắp đặt chậu rửa lavabo treo tường + vòi + bộ xả', price: '300.000' },
      { stt: 2, name: 'Lắp đặt chậu rửa lavabo đặt bàn + vòi + bộ xả', price: '350.000' },
      { stt: 3, name: 'Lắp đặt chậu rửa lavabo dương vành + vòi + bộ xả', price: '350.000' },
      { stt: 4, name: 'Lắp đặt chậu rửa lavabo âm bàn + vòi + bộ xả', price: '450.000' },
      { stt: 5, name: 'Lắp đặt tủ chậu lavabo + vòi + bộ xả', price: '450.000' },
      { stt: 6, name: 'Tháo gỡ chậu rửa Lavabo (Các loại)', price: '100.000' },
      { stt: 7, name: 'Lắp đặt vòi Lavabo lạnh, nóng lạnh + bộ xả', price: '200.000' },
      { stt: 8, name: 'Lắp đặt xiphong (ống thải lavabo)', price: '150.000' },
    ],
    'SEN TẮM': [
      { stt: 1, name: 'Lắp đặt sen tắm lạnh', price: '150.000' },
      { stt: 2, name: 'Lắp đặt sen tắm nóng lạnh', price: '200.000' },
      { stt: 3, name: 'Lắp đặt sen cây lạnh', price: '250.000' },
      { stt: 4, name: 'Lắp đặt sen cây nóng lạnh', price: '300.000' },
      { stt: 5, name: 'Lắp đặt thân sen cây nóng lạnh', price: '250.000' },
      { stt: 6, name: 'Tháo gỡ sen tắm', price: '50.000' },
      { stt: 7, name: 'Lắp đặt sen âm tường 1 đường nước', price: '1.400.000' },
      { stt: 8, name: 'Lắp đặt sen âm tường 2 - 3 đường nước', price: '2.600.000' },
      { stt: 9, name: 'Lắp đặt sen âm tường có thiết bị massage', price: '4.500.000' },
      { stt: 10, name: 'Lắp phòng tắm đứng', price: '1.500.000' },
    ],
    'BỒN TẮM': [
      { stt: 1, name: 'Lắp đặt bồn tắm nằm chân yếm, thường', price: '600.000' },
      { stt: 2, name: 'Lắp đặt bồn tắm nằm chân yếm, massage', price: '1.000.000' },
      { stt: 3, name: 'Lắp đặt bồn xây thường', price: '700.000' },
      { stt: 4, name: 'Tháo dỡ bồn tắm nằm (không gồm vận chuyển đi)', price: '150.000' },
      { stt: 5, name: 'Lắp đặt khay tắm đứng có chân đế', price: '350.000' },
    ],
    'BỒN TIỂU': [
      { stt: 1, name: 'Lắp đặt bồn tiểu nam + van tiểu', price: '400.000' },
      { stt: 2, name: 'Tháo gỡ bồn tiểu nam', price: '50.000' },
      { stt: 3, name: 'Van tiểu nam dương tường', price: '150.000' },
      { stt: 4, name: 'Tháo gỡ van tiểu nam', price: '50.000' },
      { stt: 5, name: 'Lắp đặt vách ngăn tiểu nam', price: '200.000' },
    ],
    'PHỤ KIỆN PHÒNG TẮM': [
      { stt: 1, name: 'Lắp đặt bộ phụ kiện', price: '300.000' },
      { stt: 2, name: 'Tháo gỡ bộ phụ kiện', price: '50.000' },
      { stt: 3, name: 'Lắp đặt gương soi', price: '200.000' },
      { stt: 4, name: 'Lắp đặt gương led', price: '300.000' },
      { stt: 5, name: 'Lắp đặt máng khăn (2,3..tầng)', price: '150.000' },
      { stt: 6, name: 'Lắp đặt thanh vắt khăn', price: '100.000' },
      { stt: 7, name: 'Lắp đặt móc áo, móc khăn, vòng khăn', price: '100.000' },
      { stt: 8, name: 'Lắp đặt hộp giấy vệ sinh', price: '100.000' },
      { stt: 9, name: 'Lắp đặt kệ xà phòng', price: '100.000' },
      { stt: 10, name: 'Lắp đặt kệ kính', price: '100.000' },
      { stt: 11, name: 'Lắp đặt các hạng mục lẻ (phụ kiện khác)', price: '50.000' },
      { stt: 12, name: 'Lắp đặt máy sấy tay', price: '200.000' },
    ],
    'BÌNH NÓNG LẠNH': [
      { stt: 1, name: 'Lắp đặt máy nước nóng trực tiếp', price: '350.000' },
      { stt: 2, name: 'Lắp đặt máy nước nóng gián tiếp (<50 lít)', price: '350.000' },
      { stt: 3, name: 'Lắp đặt máy nước nóng gián tiếp (>50 lít)', price: '450.000' },
      { stt: 4, name: 'Lắp đặt máy nước nóng gián tiếp (>100 lít)', price: '800' },
      { stt: 5, name: 'Cộng thêm phí lắp máy nước nóng âm trần', price: '150.000' },
      { stt: 6, name: 'Tháo dỡ máy nước nóng cũ', price: '50.000' },
      { stt: 7, name: 'Lắp đặt máy NLMT ống dưới 160 lít (mái bằng)', price: '600.000' },
      { stt: 8, name: 'Lắp đặt máy NLMT ống trên 180 lít (mái bằng)', price: '700.000' },
    ],
    'THIẾT BỊ BẾP': [
      { stt: 1, name: 'Lắp đặt chậu rửa chén + Vòi', price: '400.000' },
      { stt: 2, name: 'Tháo gỡ chậu rửa chén', price: '100.000' },
      { stt: 3, name: 'Lắp đặt vòi bếp lạnh, nóng lạnh', price: '300.000' },
      { stt: 4, name: 'Tháo gỡ vòi bếp lạnh, nóng lạnh', price: '50.000' },
      { stt: 5, name: 'Lắp đặt máy hút mùi, bếp, máy rửa chén', price: '400.000' },
      { stt: 6, name: 'Tháo gỡ máy cũ', price: '50.000' },
    ],
  };
  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  get currentFeeTable() {
    return this.feeTables[this.selectedCategory] || [];
  }
  steps = [
    {
      title: 'Xử lý sản phẩm cũ',
      details: ['Kiểm tra và tháo gỡ sản phẩm cần thay thế'],
    },
    {
      title: 'Vệ sinh khu vực tháo gỡ',
      details: [
        'Vệ sinh khu vực tháo gỡ sản phẩm, đảm bảo bề mặt sạch sẽ để lắp đặt sản phẩm mới',
      ],
    },
    {
      title: 'Kiểm tra vị trí lắp đặt',
      details: [
        'Kiểm tra vị trí cần lắp đặt',
        'Đảm bảo đúng với bản vẽ kỹ thuật',
      ],
    },
    {
      title: 'Lắp đặt',
      details: [
        'Lắp đặt sản phẩm và các phụ kiện đi kèm (nếu có)',
        'Kiểm tra hệ thống xả nước, các vị trí đặt, lắp ráp',
      ],
    },

    {
      title: 'Vận hành thử nghiệm',
      details: ['Vận hành thử sản phẩm, đảm bảo hoạt động tốt', 'Vệ sinh khu vực thi công'],
    },

    {
      title: 'Hướng dẫn sử dụng và bàn giao',
      details: [
        'Hướng dẫn khách hàng sử dụng sản phẩm',
        'Bàn giao khách hàng',
      ],
    },
  ];


}
