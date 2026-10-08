import React, { useState } from 'react';
import { SellerListing, SupportedLanguage, PageView } from '../types';
import { TRANSLATIONS } from '../translations';
import { isMyListing } from '../utils/storage';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone,
  AlertTriangle,
  ArrowLeft,
  ShoppingBag,
  CheckCircle
} from 'lucide-react';

interface MyListingsPageProps {
  listings: SellerListing[];
  language: SupportedLanguage;
  onNavigate: (page: PageView) => void;
  onEditListing: (listing: SellerListing) => void;
  onDeleteListing: (listingId: string) => void;
  onSelectSeller: (seller: SellerListing) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({
  listings,
  language,
  onNavigate,
  onEditListing,
  onDeleteListing,
  onSelectSeller,
}) => {
  const t = TRANSLATIONS[language];
  const [listingToDelete, setListingToDelete] = useState<SellerListing | null>(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);

  // Filter listings owned by this user
  const myListings = listings.filter((l) => l.isMyListing || isMyListing(l.id));

  const handleDeleteConfirm = () => {
    if (listingToDelete) {
      onDeleteListing(listingToDelete.id);
      setDeleteSuccessToast(`"${listingToDelete.name}" was deleted successfully.`);
      setListingToDelete(null);
      setTimeout(() => setDeleteSuccessToast(null), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            id="my-listings-back-home-btn"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B5749] hover:text-[#3D2B1F] mb-3 px-3 py-1.5 rounded-xl hover:bg-[#EFE4D3] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.sellerListing.backToHome}</span>
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold font-heritage text-[#3D2B1F]">
            {t.myListings?.pageTitle || 'My Listings'}
          </h1>
          <p className="text-sm sm:text-base text-[#6B5749] mt-1 font-medium">
            {t.myListings?.pageSubtitle || 'Manage your active service offerings and make updates anytime'}
          </p>
        </div>

        {/* Create New Listing Button */}
        <button
          id="create-new-listing-btn"
          onClick={() => onNavigate('seller-listing')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.myListings?.createNewBtn || 'Add New Service Listing'}</span>
        </button>
      </div>

      {/* Delete Success Notification Toast */}
      {deleteSuccessToast && (
        <div className="mb-6 p-4 rounded-2xl bg-[#EEF6F2] border border-[#C7E4D3] text-[#1E4D38] text-sm font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-[#1E4D38]" />
            <span>{deleteSuccessToast}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessToast(null)}
            className="text-xs text-[#1E4D38] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Listings Count Header */}
      <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-[#6B5749] font-semibold border-b border-[#EADBCE] pb-3">
        <span>
          {myListings.length} {myListings.length === 1 ? 'service active' : 'services active'}
        </span>
        <span className="text-[#C2542D]">
          {t.sellerProfile?.hlNoCommission || 'Zero commission'}
        </span>
      </div>

      {/* LISTINGS CONTAINER */}
      {myListings.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] p-8 sm:p-14 text-center shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-[#FBEEE8] text-[#C2542D] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold font-heritage text-[#3D2B1F] mb-2">
            {t.myListings?.emptyTitle || 'You have not listed any skills yet'}
          </h3>

          <p className="text-sm sm:text-base text-[#6B5749] max-w-md mx-auto mb-6 leading-relaxed">
            {t.myListings?.emptySubtitle || 'Offer tailoring, home cooking, tutoring, mehendi, or other skills to local neighborhood buyers with zero commission.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="empty-create-listing-btn"
              onClick={() => onNavigate('seller-listing')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#C2542D] hover:bg-[#A13D19] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t.myListings?.createFirstBtn || 'Create Your First Listing Now'}</span>
            </button>

            <button
              id="empty-browse-btn"
              onClick={() => onNavigate('buyer-search')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#FAF5EB] text-[#3D2B1F] font-bold text-sm sm:text-base border border-[#EADBCE] transition-all cursor-pointer"
            >
              {t.nav.findServices}
            </button>
          </div>
        </div>
      ) : (
        /* Listings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <div
              key={listing.id}
              id={`my-listing-card-${listing.id}`}
              className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Category Badge */}
                <div className="relative h-48 w-full bg-[#EFE4D3] overflow-hidden">
                  <img
                    src={listing.photo}
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-xl bg-[#C2542D] text-white text-xs font-bold shadow-xs">
                      {t.categories[listing.category]?.title || listing.category}
                    </span>
                    {listing.isShgVerified && (
                      <span className="px-2.5 py-1 rounded-xl bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] text-xs font-bold shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SHG</span>
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-[#FFFDF9]/95 text-[#C2542D] px-3.5 py-1.5 rounded-xl font-extrabold text-base shadow-sm border border-[#EADBCE]">
                    {listing.price}
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold font-heritage text-[#3D2B1F] line-clamp-1">
                    {listing.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-[#6B5749] font-medium">
                    <MapPin className="w-4 h-4 text-[#C2542D] shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C4433] line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="pt-2 border-t border-[#EADBCE] flex items-center justify-between text-[11px] text-[#8C7E74]">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#1E4D38]" />
                      <span>{listing.phone || 'Phone verified'}</span>
                    </span>
                    <span>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="p-4 bg-[#FAF5EB] border-t border-[#EADBCE] grid grid-cols-3 gap-2">
                {/* View as Buyer */}
                <button
                  type="button"
                  id={`view-buyer-${listing.id}`}
                  onClick={() => {
                    onSelectSeller(listing);
                    onNavigate('seller-profile');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#FFFDF9] hover:bg-[#EFE4D3] border border-[#EADBCE] text-[#3D2B1F] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="View Profile as Buyer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1E4D38]" />
                  <span>View</span>
                </button>

                {/* Edit Listing */}
                <button
                  type="button"
                  id={`edit-listing-${listing.id}`}
                  onClick={() => onEditListing(listing)}
                  className="py-2.5 px-2 rounded-xl bg-[#FFFDF9] hover:bg-[#FBEEE8] border border-[#EADBCE] hover:border-[#C2542D] text-[#C2542D] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Edit Listing Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Delete Listing */}
                <button
                  type="button"
                  id={`delete-listing-${listing.id}`}
                  onClick={() => setListingToDelete(listing)}
                  className="py-2.5 px-2 rounded-xl bg-[#FFFDF9] hover:bg-[#FDF1EC] border border-[#EADBCE] hover:border-red-300 text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Delete Listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {listingToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setListingToDelete(null)}
        >
          <div
            id="delete-confirm-modal"
            className="bg-[#FFFDF9] w-full max-w-md rounded-3xl p-6 sm:p-7 border-2 border-[#EADBCE] shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF1EC] text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold font-heritage text-[#3D2B1F]">
                {t.myListings?.confirmDeleteTitle || 'Delete this listing?'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5749] mt-1.5 leading-relaxed">
                {t.myListings?.confirmDeleteDesc || `Are you sure you want to remove "${listingToDelete.name}"? This action cannot be undone.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setListingToDelete(null)}
                className="py-3 px-4 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE4D3] text-[#3D2B1F] font-bold text-xs sm:text-sm border border-[#EADBCE] transition-colors cursor-pointer"
              >
                {t.myListings?.cancelAction || 'Cancel'}
              </button>

              <button
                type="button"
                id="confirm-delete-action-btn"
                onClick={handleDeleteConfirm}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
              >
                {t.myListings?.confirmDeleteAction || 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
