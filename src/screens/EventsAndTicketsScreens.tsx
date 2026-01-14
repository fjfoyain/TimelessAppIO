
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Event, PurchasedTicket, ResaleTicket, User, Review } from '../types';
import { Card, Button, Modal, Input, Tag, EmptyState, Spinner } from '../components/ui';
import { WalletIcon, CheckCircleIcon, StarIcon, MapPinIcon, ViewGridIcon, MapIcon, ViewListIcon, TicketIcon } from '../components/icons';

// 1. Google Maps Embed (For Viewing - Robust & Fast)
export const GoogleMapsView: React.FC<{ lat: number; lng: number; title?: string }> = ({ lat, lng, title }) => {
    const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-day-border dark:border-night-border bg-gray-100 dark:bg-gray-800 relative">
             <iframe
                title={title || "Location Map"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={src}
            ></iframe>
            <div className="absolute top-0 left-0 bg-white/80 dark:bg-black/80 p-1 px-2 text-[10px] rounded-br-lg backdrop-blur-sm z-10 pointer-events-none">
                Google Maps
            </div>
        </div>
    );
};

// 2. Location Picker (Leaflet - Interactive for Selection)
export const LocationPicker: React.FC<{ 
    initialLat?: number; 
    initialLng?: number; 
    onLocationSelect: (lat: number, lng: number) => void;
    className?: string;
}> = ({ initialLat, initialLng, onLocationSelect, className = "h-64" }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current && (window as any).L) {
            const center: [number, number] = [initialLat || 40.7128, initialLng || -74.0060];
            
            mapInstance.current = (window as any).L.map(mapRef.current).setView(center, 13);

            (window as any).L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(mapInstance.current);

            const icon = (window as any).L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Initial Marker
            if (initialLat && initialLng) {
                markerInstance.current = (window as any).L.marker(center, { icon }).addTo(mapInstance.current);
            }

            // Click Handler
            mapInstance.current.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                if (markerInstance.current) {
                    markerInstance.current.setLatLng([lat, lng]);
                } else {
                    markerInstance.current = (window as any).L.marker([lat, lng], { icon }).addTo(mapInstance.current);
                }
                onLocationSelect(lat, lng);
            });
        }
        
        return () => {
            if(mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        }
    }, []);

    return <div ref={mapRef} className={`w-full rounded-lg z-0 ${className}`}></div>;
};

// PurchaseModal Component
const PurchaseModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    event: Event, 
    onPurchase: (
        eventId: string, 
        tierId: string, 
        quantity: number, 
        products: { productId: string, name: string, quantity: number }[],
        productAssignments?: Record<number, { productId: string, name: string, quantity: number }[]>
    ) => boolean 
}> = ({ isOpen, onClose, event, onPurchase }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'selection' | 'assignment' | 'success'>('selection');
    const [selectedTier, setSelectedTier] = useState<string>(event.ticketTiers.find(t => t.totalQuantity - t.sold > 0)?.id || '');
    const [quantity, setQuantity] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
    const [assignments, setAssignments] = useState<Record<number, Record<string, number>>>({});

    const tier = event.ticketTiers.find(t => t.id === selectedTier);
    const ticketsPrice = (tier?.price || 0) * quantity;
    const productsPrice = Object.entries(selectedProducts).reduce((acc, [productId, qty]) => {
        const product = event.products.find(p => p.id === productId);
        return acc + (product?.price || 0) * (qty as number);
    }, 0);
    const totalPrice = ticketsPrice + productsPrice;
    
    const handleProductQuantityChange = (productId: string, change: number) => {
        setSelectedProducts(prev => {
            const newQty = (prev[productId] || 0) + change;
            if (newQty <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQty };
        });
    };

    const handleNext = () => {
        const hasProducts = Object.keys(selectedProducts).length > 0;
        if (quantity > 1 && hasProducts) {
            setStep('assignment');
        } else {
            handlePurchase();
        }
    };

    const handlePurchase = () => {
        const productsToPurchase = Object.entries(selectedProducts).map(([productId, quantity]) => ({
            productId,
            quantity: quantity as number,
            name: event.products.find(p => p.id === productId)!.name,
        }));

        let productAssignmentsPayload: Record<number, { productId: string, name: string, quantity: number }[]> | undefined = undefined;
        
        if (step === 'assignment') {
            productAssignmentsPayload = {};
            Object.entries(assignments).forEach(([ticketIndex, prodMap]) => {
                productAssignmentsPayload![parseInt(ticketIndex)] = Object.entries(prodMap).map(([pId, qty]) => ({
                    productId: pId,
                    name: event.products.find(p => p.id === pId)!.name,
                    quantity: qty
                })).filter(p => p.quantity > 0);
            });
        } else if (quantity === 1 && Object.keys(selectedProducts).length > 0) {
             productAssignmentsPayload = {
                 0: productsToPurchase
             };
        }

        const success = onPurchase(event.id, selectedTier, quantity, productsToPurchase, productAssignmentsPayload);
        if (success) {
            setStep('success');
        }
    };
    
    const handleClose = () => {
        setStep('selection');
        setSelectedTier(event.ticketTiers.find(t => t.totalQuantity - t.sold > 0)?.id || '');
        setQuantity(1);
        setSelectedProducts({});
        setAssignments({});
        onClose();
    }

    const getAssignedTotal = (productId: string): number => {
        return Object.values(assignments).reduce((sum: number, ticketMap) => sum + (ticketMap[productId] || 0), 0);
    };
    
    const handleAssignmentChange = (ticketIndex: number, productId: string, change: number) => {
        const currentTotalAssigned = getAssignedTotal(productId);
        const maxAvailable = selectedProducts[productId];
        const currentAssignedToThisTicket = assignments[ticketIndex]?.[productId] || 0;
        
        if (change > 0 && currentTotalAssigned >= maxAvailable) return;
        if (change < 0 && currentAssignedToThisTicket <= 0) return;

        setAssignments(prev => {
            const ticketAssignments = prev[ticketIndex] || {};
            return {
                ...prev,
                [ticketIndex]: {
                    ...ticketAssignments,
                    [productId]: currentAssignedToThisTicket + change
                }
            };
        });
    };

    const isAssignmentComplete = () => {
        return Object.entries(selectedProducts).every(([pId, totalQty]) => getAssignedTotal(pId) === totalQty);
    };

    const availableTickets = tier ? tier.totalQuantity - tier.sold : 0;
    const isSoldOut = availableTickets <= 0 || !tier;

    const renderSelection = () => (
         <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
                <label className="block text-sm font-medium mb-1">Ticket Type</label>
                <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)} className="w-full p-3 rounded-lg bg-day-surface/50 dark:bg-night-surface/50 border border-day-border dark:border-night-border">
                    {event.ticketTiers.map(t => {
                        const available = t.totalQuantity - t.sold;
                        return <option key={t.id} value={t.id} disabled={available <= 0}>{t.name} (${t.price}) - {available > 0 ? `${available} left` : 'Sold Out'}</option>
                    })}
                </select>
            </div>
            {!isSoldOut && <Input label="Quantity" type="number" min="1" max={availableTickets} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(availableTickets, parseInt(e.target.value) || 1)))} />}
            
            {event.products.length > 0 && <h4 className="font-bold pt-4 border-t border-day-border dark:border-night-border">Add to your order</h4>}
            {event.products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-lg bg-day-surface dark:bg-night-surface/50 border border-day-border dark:border-night-border">
                    <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover"/>
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-day-text-secondary">${product.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleProductQuantityChange(product.id, -1)}>-</Button>
                        <span className="w-6 text-center font-mono">{selectedProducts[product.id] || 0}</span>
                        <Button size="sm" variant="secondary" onClick={() => handleProductQuantityChange(product.id, 1)}>+</Button>
                    </div>
                </div>
            ))}

            <div className="text-right pt-4 border-t border-day-border dark:border-night-border">
                <p className="text-day-text-secondary">Total Price</p>
                <p className="text-3xl font-serif font-bold text-day-accent dark:text-night-accent">${totalPrice.toLocaleString()}</p>
            </div>
            <Button fullWidth onClick={handleNext} disabled={isSoldOut} className="mt-4">
                {quantity > 1 && Object.keys(selectedProducts).length > 0 ? "Next: Assign Extras" : "Confirm Purchase"}
            </Button>
        </div>
    );

    const renderAssignment = () => (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
             <p className="text-sm text-day-text-secondary">You have purchased extras. Please assign them to specific tickets.</p>
             
             <div className="p-3 bg-day-accent/10 border border-day-accent/20 rounded-lg">
                 <h4 className="font-bold text-sm uppercase tracking-wide mb-2">Extras to Assign</h4>
                 <div className="flex flex-wrap gap-2">
                     {Object.entries(selectedProducts).map(([pId, total]) => {
                         const assigned = getAssignedTotal(pId);
                         const remaining = (total as number) - assigned;
                         const product = event.products.find(p => p.id === pId);
                         return (
                             <Tag key={pId}>
                                 {product?.name}: {remaining} left
                             </Tag>
                         );
                     })}
                 </div>
             </div>

             <div className="space-y-3">
                 {Array.from({ length: quantity }).map((_, index) => (
                     <Card key={index} className="p-4 border border-day-border dark:border-night-border">
                         <div className="flex justify-between items-center mb-3 border-b border-day-border dark:border-night-border pb-2">
                            <h4 className="font-bold">Ticket #{index + 1}</h4>
                            <span className="text-xs text-day-text-secondary">{tier?.name}</span>
                         </div>
                         
                         {Object.entries(selectedProducts).map(([pId, totalQty]) => {
                             const product = event.products.find(p => p.id === pId);
                             const assignedToThis = assignments[index]?.[pId] || 0;
                             const totalAssignedGlobal = getAssignedTotal(pId);
                             const canAdd = totalAssignedGlobal < (totalQty as number);

                             return (
                                 <div key={pId} className="flex justify-between items-center mb-2 last:mb-0">
                                     <span className="text-sm">{product?.name}</span>
                                     <div className="flex items-center gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleAssignmentChange(index, pId, -1)} disabled={assignedToThis === 0}>-</Button>
                                        <span className="w-4 text-center text-sm">{assignedToThis}</span>
                                        <Button size="sm" variant="secondary" onClick={() => handleAssignmentChange(index, pId, 1)} disabled={!canAdd}>+</Button>
                                     </div>
                                 </div>
                             );
                         })}
                     </Card>
                 ))}
             </div>
             
             <Button fullWidth onClick={handlePurchase} disabled={!isAssignmentComplete()} className="mt-4">
                 {isAssignmentComplete() ? "Confirm Assignments & Purchase" : "Assign All Extras to Continue"}
             </Button>
             <Button fullWidth variant="secondary" onClick={() => setStep('selection')} className="mt-2">Back</Button>
        </div>
    );
    
    const renderSuccess = () => (
        <div className="text-center p-8">
            <CheckCircleIcon className="w-20 h-20 text-day-success dark:text-night-success mx-auto" />
            <h3 className="text-3xl font-serif font-bold mt-4">Purchase Successful!</h3>
            <p className="text-day-text-secondary mt-2">Your tickets and items have been added to your wallet.</p>
            <div className="mt-6 bg-day-surface dark:bg-night-surface/50 p-4 rounded-lg text-left border border-day-border dark:border-night-border">
                <h4 className="font-bold border-b border-day-border dark:border-night-border pb-2 mb-2">Summary:</h4>
                <div className="flex justify-between">
                    <span>{quantity} x {tier?.name}</span>
                    <span>${ticketsPrice.toLocaleString()}</span>
                </div>
                 {Object.entries(selectedProducts).map(([productId, qty]) => (
                    <div key={productId} className="flex justify-between text-sm text-day-text-secondary">
                        <span>{qty} x {event.products.find(p=>p.id === productId)?.name}</span>
                        <span>${((event.products.find(p=>p.id === productId)?.price || 0) * (qty as number)).toLocaleString()}</span>
                    </div>
                 ))}
                 <div className="flex justify-between font-bold mt-2 pt-2 border-t border-day-border dark:border-night-border">
                     <span>Total:</span>
                     <span>${totalPrice.toLocaleString()}</span>
                 </div>
            </div>
            <Button fullWidth className="mt-6" onClick={() => { handleClose(); navigate('/tickets/wallet'); }}>Go to My Wallet</Button>
            <Button variant="secondary" className="mt-2" onClick={handleClose}>Close</Button>
        </div>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title={step === 'selection' ? `Buy Tickets: ${event.title}` : step === 'assignment' ? 'Assign Extras' : 'Order Confirmed'}
        >
           {step === 'selection' && renderSelection()}
           {step === 'assignment' && renderAssignment()}
           {step === 'success' && renderSuccess()}
        </Modal>
    );
};

export const MapView: React.FC<{ events: {lat: number, lng: number, id: string, title: string, location: string}[]; hoveredEventId: string | null; mapId: string; center?: [number, number]; zoom?: number; singlePin?: boolean; onBoundsChange?: (bounds: any) => void; onMapClick?: (latlng: { lat: number, lng: number }) => void; }> = ({ events, hoveredEventId, mapId, center, zoom, singlePin, onBoundsChange, onMapClick }) => {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Record<string, any>>({});

    const defaultIcon = (window as any).L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });
    const highlightedIcon = (window as any).L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        iconSize: [35, 57],
        iconAnchor: [17, 57],
        popupAnchor: [1, -48],
    });

    useEffect(() => {
        if (document.getElementById(mapId) && !mapRef.current) {
            const mapCenter: [number, number] = center || [40.7128, -74.0060];
            const mapZoom = zoom || 5;

            mapRef.current = (window as any).L.map(mapId, { scrollWheelZoom: !singlePin }).setView(mapCenter, mapZoom);
            (window as any).L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(mapRef.current);
            
            if (onBoundsChange) {
                mapRef.current.on('moveend', () => {
                    onBoundsChange(mapRef.current.getBounds());
                });
            }
            if (onMapClick) {
                mapRef.current.on('click', (e: any) => {
                    onMapClick(e.latlng);
                });
            }
        }
    }, [mapId, center, zoom, onBoundsChange, onMapClick, singlePin]);
    
    useEffect(() => {
        if (!mapRef.current) return;
        Object.values(markersRef.current).forEach((marker: any) => marker.remove());
        markersRef.current = {};

        events.forEach(event => {
            const popupContent = event.title ? `<b>${event.title}</b><br>${event.location}<br><a href="#/events/${event.id}">View Event</a>` : 'Selected Location';
            const marker = (window as any).L.marker([event.lat, event.lng], { icon: defaultIcon })
                .addTo(mapRef.current)
                .bindPopup(popupContent);
            markersRef.current[event.id] = marker;
        });
        
        if (!singlePin && events.length > 0 && mapRef.current.getBoundsZoom( (window as any).L.latLngBounds(events.map(e => [e.lat, e.lng])) ) > mapRef.current.getZoom()) {
             const bounds = (window as any).L.latLngBounds(events.map(e => [e.lat, e.lng]));
             if(bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

    }, [events, mapId, singlePin]);

    useEffect(() => {
        if (!mapRef.current) return;
        Object.entries(markersRef.current).forEach(([id, marker]: [string, any]) => {
            if (id === hoveredEventId) {
                marker.setIcon(highlightedIcon);
                marker.setZIndexOffset(1000);
            } else {
                marker.setIcon(defaultIcon);
                 marker.setZIndexOffset(0);
            }
        });
    }, [hoveredEventId]);

    return <div id={mapId} className="h-full w-full rounded-lg z-0"></div>;
};

export const EventsListScreen: React.FC<{ events: Event[] }> = ({ events }) => {
    const [mapBounds, setMapBounds] = useState(null);
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
    const [searchOnMapMove, setSearchOnMapMove] = useState(true);
    
    const eventsInView = useMemo(() => {
        if (!mapBounds || !searchOnMapMove) return events;
        return events.filter(event => {
            const eventLatLng = (window as any).L.latLng(event.lat, event.lng);
            return mapBounds.contains(eventLatLng);
        });
    }, [events, mapBounds, searchOnMapMove]);

    const EventGrid = ({ eventsToDisplay }: { eventsToDisplay: Event[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsToDisplay.length > 0 ? eventsToDisplay.map((event, i) => (
                <div key={event.id} onMouseEnter={() => setHoveredEventId(event.id)} onMouseLeave={() => setHoveredEventId(null)}>
                    <Card isHoverable className="animate-slide-up-fade flex flex-col group h-full" style={{animationDelay: `${i*50}ms`}}>
                        <Link to={`/events/${event.id}`} className="flex flex-col flex-grow">
                            <div className="aspect-video overflow-hidden">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <p className="text-sm font-semibold text-day-accent dark:text-night-accent">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                <h3 className="text-xl font-serif font-bold mt-1 truncate">{event.title}</h3>
                                <p className="text-day-text-secondary dark:text-night-text-secondary mt-1 text-sm">{event.location}</p>
                            </div>
                        </Link>
                    </Card>
                </div>
            )) : <div className="md:col-span-2"><EmptyState title="No Events Found" description="There are no events in this area of the map. Try moving the map or disabling 'Search as I move map'." /></div>}
        </div>
    );

    return (
        <div className="max-w-screen-2xl mx-auto pt-24 pb-12">
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">Upcoming Events</h1>
                <p className="text-lg text-day-text-secondary dark:text-night-text-secondary">Discover exclusive events hosted by our partners.</p>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className={`lg:col-span-7 ${mobileView === 'map' ? 'hidden' : ''} lg:block`}>
                    <div className="p-2 mb-4 flex items-center gap-2">
                        <input type="checkbox" id="searchOnMove" checked={searchOnMapMove} onChange={e => setSearchOnMapMove(e.target.checked)} />
                        <label htmlFor="searchOnMove" className="text-sm">Search as I move map</label>
                    </div>
                    <EventGrid eventsToDisplay={eventsInView} />
                </div>
                <div className={`lg:col-span-5 h-[calc(100vh-10rem)] sticky top-28 ${mobileView === 'list' ? 'hidden' : ''} lg:block`}>
                    <MapView events={events} hoveredEventId={hoveredEventId} mapId="events-list-map" onBoundsChange={setMapBounds} />
                </div>
            </div>
            
            <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-20">
                <Button onClick={() => setMobileView(v => v === 'list' ? 'map' : 'list')}>
                    {mobileView === 'list' ? <><MapIcon className="w-5 h-5 mr-2" /> Show Map</> : <><ViewListIcon className="w-5 h-5 mr-2" /> Show List</>}
                </Button>
            </div>
        </div>
    );
};

export const ReviewForm: React.FC<{ onSubmit: (rating: number, comment: string) => void }> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating > 0 && comment.trim()) {
            onSubmit(rating, comment);
            setRating(0);
            setComment('');
        }
    };
    
    return (
        <Card className="p-6 mt-6">
            <h3 className="text-2xl font-serif font-bold mb-4">Leave a Review</h3>
            <div className="flex items-center mb-4">
                {[1,2,3,4,5].map(star => <button key={star} onClick={() => setRating(star)}><StarIcon className={`w-6 h-6 ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`} /></button>)}
            </div>
            <textarea className="w-full p-3 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded-lg text-base" rows={4} placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} />
            <Button className="mt-4" onClick={handleSubmit}>Submit Review</Button>
        </Card>
    );
};

export const EventDetailScreen: React.FC<{ events: Event[], resaleTickets: ResaleTicket[], onPurchase: (...args: any) => boolean, onPurchaseResale: (id: string) => void, currentUser: User | null, onReviewSubmit: (eventId: string, rating: number, comment: string) => void, userTickets: PurchasedTicket[] }> = ({ events, resaleTickets, onPurchase, onPurchaseResale, currentUser, onReviewSubmit, userTickets }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    useEffect(() => {
        const foundEvent = events.find(e => e.id === id);
        if (foundEvent) setEvent(foundEvent);
        else navigate('/404');
    }, [id, events, navigate]);
    
    const canReview = useMemo(() => {
        if (!currentUser || !event) return false;
        // Check if user OWNS a ticket for this event
        const hasTicket = userTickets.some(t => t.eventId === id && t.ownerId === currentUser.id);
        // Check if event date has passed
        const eventHasPassed = new Date() > new Date(event.date);
        return hasTicket && eventHasPassed;
    }, [currentUser, userTickets, id, event]);

    if (!event) return <div>Loading...</div>;

    const eventResaleTickets = resaleTickets.filter(t => t.eventId === event.id);

    return (
        <>
        <div className="max-w-screen-xl mx-auto pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <Card className="overflow-hidden animate-fade-in">
                        <img src={event.image} alt={event.title} className="w-full h-96 object-cover" />
                        <div className="p-8">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold">{event.title}</h1>
                            <p className="text-lg text-day-text-secondary mt-2">{event.location} &bull; {new Date(event.date).toLocaleString()}</p>
                            <p className="mt-6 whitespace-pre-line max-w-prose">{event.description}</p>
                        </div>
                    </Card>
                     <Card className="p-8 animate-slide-up-fade">
                        <h2 className="text-3xl font-serif font-bold mb-4">Reviews ({event.reviews?.length || 0})</h2>
                        {event.reviews && event.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {event.reviews.map(review => (
                                    <Card key={review.id} className="p-4"><p><strong>{review.author}:</strong> "{review.comment}" ({review.rating}/5)</p></Card>
                                ))}
                            </div>
                        ) : <p>No reviews for this event yet.</p>}
                        {canReview && <ReviewForm onSubmit={(rating, comment) => onReviewSubmit(event.id, rating, comment)} />}
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6 h-fit sticky top-28">
                    <Card className="p-6 animate-slide-up-fade">
                        <h2 className="text-3xl font-serif font-bold mb-4">Buy Tickets</h2>
                        <Button fullWidth onClick={() => setIsPurchaseModalOpen(true)}>Buy From Organizer</Button>
                    </Card>
                    <div className="aspect-video animate-slide-up-fade">
                         <GoogleMapsView lat={event.lat} lng={event.lng} />
                    </div>
                    {eventResaleTickets.length > 0 && (
                        <Card className="p-6 animate-slide-up-fade" style={{animationDelay: '100ms'}}>
                             <h2 className="text-3xl font-serif font-bold mb-4">Resale Market</h2>
                             <div className="space-y-3">
                                {eventResaleTickets.map(ticket => (
                                    <Card key={ticket.id} className="p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{event.ticketTiers.find(t=>t.id === ticket.tierId)?.name}</p>
                                            <p className="text-sm">Asking: <span className="font-bold text-day-accent dark:text-night-accent">${ticket.price}</span></p>
                                        </div>
                                        <Button size="sm" onClick={() => onPurchaseResale(ticket.id)}>Buy Now</Button>
                                    </Card>
                                ))}
                             </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
        {isPurchaseModalOpen && <PurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} event={event} onPurchase={onPurchase} />}
        </>
    );
}

// TransferModal
const TransferModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: (email: string) => void }> = ({ isOpen, onClose, onConfirm }) => {
    const [email, setEmail] = useState('');
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transfer Ticket">
            <p className="mb-4 text-day-text-secondary">Enter the email address of the Timeless user you want to transfer this ticket to. This action is irreversible.</p>
            <div className="space-y-4">
                <Input label="Recipient's Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="recipient@example.com" />
                <Button fullWidth onClick={() => onConfirm(email)}>Confirm Transfer</Button>
            </div>
        </Modal>
    );
}

// TicketWalletScreen Component
export const TicketWalletScreen: React.FC<{ tickets: PurchasedTicket[], allEvents: Event[], onListForResale: (ticketId: string, price: number) => void, onTransfer: (ticketId: string, email: string) => void }> = ({ tickets, allEvents, onListForResale, onTransfer }) => {
    const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket|null>(null);
    const [ticketToTransfer, setTicketToTransfer] = useState<PurchasedTicket|null>(null);
    const [resalePrice, setResalePrice] = useState('');

    const handleListClick = (ticket: PurchasedTicket) => {
        setSelectedTicket(ticket);
    };

    const handleConfirmResale = () => {
        if(!selectedTicket || !resalePrice) return;
        onListForResale(selectedTicket.id, parseFloat(resalePrice));
        setSelectedTicket(null);
        setResalePrice('');
    };

    const handleConfirmTransfer = (email: string) => {
        if (!ticketToTransfer || !email) return;
        onTransfer(ticketToTransfer.id, email);
        setTicketToTransfer(null);
    }

    return (
        <>
        <div className="max-w-screen-xl mx-auto pt-24 pb-12 px-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8">My Ticket Wallet</h1>
            {tickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tickets.map(ticket => {
                        const event = allEvents.find(e => e.id === ticket.eventId);
                        if (!event) return null;
                        const tier = event.ticketTiers.find(t=>t.id === ticket.tierId);
                        
                        return (
                            <Card key={ticket.id} className="flex flex-col overflow-hidden">
                                <img src={ticket.qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto mt-4 p-2 bg-white rounded-lg" />
                                <div className="p-4 flex-grow">
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <p className="text-sm text-day-text-secondary">{new Date(event.date).toLocaleString()}</p>
                                    <Tag>{tier?.name}</Tag>
                                    {ticket.purchasedProducts && ticket.purchasedProducts.length > 0 && (
                                        <div className="mt-2 text-xs text-day-text-secondary">
                                            <p className="font-semibold">Add-ons:</p>
                                            <ul className="list-disc list-inside">
                                                {ticket.purchasedProducts.map(p => <li key={p.productId}>{p.quantity}x {p.name}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 pt-0 space-y-2 bg-day-surface dark:bg-night-surface border-t border-day-border dark:border-night-border">
                                    <Button fullWidth variant="secondary" onClick={() => handleListClick(ticket)}>List for Resale</Button>
                                    <Button fullWidth variant="secondary" onClick={() => setTicketToTransfer(ticket)}>Transfer Ticket</Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<TicketIcon className="w-16 h-16"/>}
                    title="Your Wallet is Empty"
                    description="You haven't purchased any tickets yet. Explore events to get started."
                    action={<Link to="/events"><Button>Explore Events</Button></Link>}
                />
            )}
        </div>

        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="List Ticket for Resale">
            {selectedTicket && (
                 <div className="space-y-4">
                     <p>Event: <strong>{allEvents.find(e => e.id === selectedTicket.eventId)?.title}</strong></p>
                     <p>Ticket: <strong>{allEvents.find(e => e.id === selectedTicket.eventId)?.ticketTiers.find(t=>t.id===selectedTicket.tierId)?.name}</strong></p>
                     <Input label="Set Resale Price" type="number" value={resalePrice} onChange={e => setResalePrice(e.target.value)} placeholder="e.g., 275" />
                     <Button fullWidth onClick={handleConfirmResale}>Confirm Listing</Button>
                </div>
            )}
        </Modal>

        {ticketToTransfer && <TransferModal isOpen={!!ticketToTransfer} onClose={() => setTicketToTransfer(null)} onConfirm={handleConfirmTransfer} />}
        </>
    );
};

export const ResaleMarketplaceScreen: React.FC<{ resaleTickets: ResaleTicket[], allEvents: Event[], onPurchase: (resaleTicketId: string) => void }> = ({ resaleTickets, allEvents, onPurchase }) => {
    return (
        <div className="max-w-screen-2xl mx-auto pt-24 pb-12 px-4">
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">Ticket Resale Marketplace</h1>
                <p className="text-lg text-day-text-secondary dark:text-night-text-secondary">Find sold-out tickets from other fans.</p>
            </div>
            {resaleTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resaleTickets.map(ticket => {
                        const event = allEvents.find(e => e.id === ticket.eventId);
                        const tier = event?.ticketTiers.find(t => t.id === ticket.tierId);
                        if (!event || !tier) return null;
                        return (
                            <Card key={ticket.id} className="p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-serif font-bold">{event.title}</h3>
                                    <p className="text-sm text-day-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                                    <Tag>{tier.name}</Tag>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-2xl font-bold font-serif">${ticket.price}</p>
                                    <Button onClick={() => onPurchase(ticket.id)}>Buy Now</Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<TicketIcon />}
                    title="No Tickets on Resale"
                    description="There are currently no tickets available on the resale market. Check back later!"
                />
            )}
        </div>
    );
};
