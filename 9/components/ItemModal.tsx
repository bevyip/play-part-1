
import React from 'react';
import { X, ExternalLink, Search } from 'lucide-react';
import { FashionItem } from '../types';

interface ItemModalProps {
  item: FashionItem;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10 text-gray-500"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between order-2 md:order-1 overflow-y-auto">
          <div>
            {/* Seller Info */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <img 
                src={item.seller.avatar} 
                alt={item.seller.name} 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 leading-tight text-sm sm:text-base">{item.seller.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-tight mt-0.5">{item.seller.bio}</p>
              </div>
            </div>

            {/* Item Details */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {item.title}
            </h1>
            <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
              <span className="text-sm sm:text-base text-gray-500 font-medium">
                {item.isSold ? 'Sold' : 'Buy for'}
              </span>
              <span className={`text-lg sm:text-xl font-bold ${item.isSold ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {item.currency}{item.price.toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-md">
              {item.details}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
            <button className="flex-1 min-w-0 sm:min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-black text-black text-sm sm:text-base font-bold rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
              See all details
            </button>
            <button className="flex-1 min-w-0 sm:min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-bold rounded-full hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
              See similar
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-[45%] bg-gray-50 p-3 sm:p-6 md:p-8 order-1 md:order-2 flex items-center justify-center">
          <div className="w-full max-w-[200px] sm:max-w-none aspect-square rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl border-2 sm:border-4 border-white">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
