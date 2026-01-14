export const translations = {
    en: {
        locale: 'en-US',
        common: {
            edit: "Edit",
            save: "Save",
            saveChanges: "Save Changes",
            cancel: "Cancel",
            delete: "Delete",
            add: "Add",
            remove: "Remove",
        },
        navbar: {
            marketplace: "Marketplace",
            events: "Events",
            resale: "Resale",
            messages: "Messages",
            dashboard: "Dashboard",
            admin: "Admin",
            wallet: "Ticket Wallet",
            signOut: "Sign Out",
            signIn: "Sign In",
            joinNow: "Join Now"
        },
        home: {
            heroTitle: "Where Exceptional Meets Opportunity.",
            heroSubtitle: "An exclusive marketplace where the world's finest creative talent connects with discerning clients. Discover, negotiate, and book with unparalleled confidence.",
            exploreButton: "Explore Talents",
            joinButton: "Join The Roster",
            feature1Title: "A Curated Roster of Elites.",
            feature1Desc: "Forget endless scrolling. Every professional on Timeless is hand-picked through a rigorous curation process. We connect you only with the best—verified, experienced, and exceptional.",
            feature2Title: "Seamless Negotiation, Secured.",
            feature2Desc: "Our integrated platform makes negotiation transparent and straightforward. All payments are secured via our escrow system, held until the job is completed to your satisfaction. Trust is built-in.",
            feature3Title: "Your Event, Elevated.",
            feature3Desc: "From exclusive parties to high-fashion galas, our platform is also home to premier events. Purchase tickets, resell with ease, and manage your access all in one place. Experience events the Timeless way.",
            ctaTitle: "Ready to Experience the Exceptional?",
            ctaSubtitle: "Whether you're looking to hire the perfect talent for your event, or you're a professional ready to join an exclusive network, your journey starts here.",
            ctaClientButton: "I'm a Client or Venue",
            ctaTalentButton: "I'm a Talent"
        },
        register: {
            step1: {
                title: "Join Timeless",
                subtitle: "First, tell us who you are. Select the profile that best fits you.",
                clientTitle: "I'm a Client",
                clientDesc: "Discover and hire exceptional professionals for your events.",
                talentTitle: "I'm a Talent",
                talentDesc: "Showcase your work to a premium clientele and get booked.",
                venueTitle: "I'm a Venue",
                venueDesc: "List your events and connect with our exclusive community.",
            },
            step2: {
                title: "Create Your Account",
                curationNotice: "To maintain our standard of quality, all new profiles are reviewed by our curation team.",
                nameLabel: "Full Name / Company Name",
                emailLabel: "Email Address",
                passwordLabel: "Password",
                categoryLabel: "Primary Category (e.g., DJ, Photographer)",
                cityLabel: "City (e.g., New York)",
                venueNameLabel: "Venue Name",
                addressLabel: "Venue Address",
                submitApplication: "Submit Application",
                createAccount: "Create Account"
            },
            step3: {
                title: "Application Received",
                message: "Thank you for your interest. Our curation team will review your application and you'll receive an email notification within 48 hours.",
                button: "Back to Home"
            },
            alreadyHaveAccount: "Already have an account?",
            signIn: "Sign In"
        },
        marketplace: {
            title: "Discover The Exceptional",
            subtitle: "Browse our curated roster of world-class creative talents.",
            collective: {
                viewing: "Viewing Collective",
            },
            filters: {
                title: "Filter Talents",
                searchPlaceholder: "Search by name, tag...",
                category: "Category",
                allCategories: "All Categories",
                city: "City",
                allCities: "All Cities",
                resetButton: "Reset Filters"
            },
            emptyState: {
                title: "No Talents Found",
                description: "Try adjusting your search filters to find the perfect match for your event."
            }
        },
        messages: {
            title: "Conversations",
            noMessages: "No messages yet.",
            placeholder: "Type your message...",
            send: "Send",
            clientOffer: "Client Offer",
            talentOffer: "Talent Offer",
            offerModal: {
                title: "Make a Counter Offer",
                label: "Offer Amount",
                placeholder: "e.g., 1500",
                cancel: "Cancel",
                submit: "Submit Offer",
            },
            editBriefModal: {
                title: "Propose Changes to Brief",
                briefTitle: "Project Brief",
                eventTypeLabel: "Event Type",
                addOnsTitle: "Add-ons",
                submitButton: "Propose Changes"
            },
            proposal: {
                eventType: "Event Type changed to",
                added: "Added",
                removed: "Removed",
            },
            status: {
                negotiating: { title: "In Negotiation", desc: "Awaiting agreement from both parties." },
                agreed: { title: "Agreement Reached", desc: "Waiting for talent to generate contract." },
                contractSent: { title: "Contract Sent", desc: "Awaiting client payment to secure booking." },
                paid: { title: "Paid & Confirmed", desc: "Funds secured in escrow until job is complete." },
                completed: { title: "Job Completed", desc: "Funds have been released to the talent." },
            },
            actions: {
                accept: "Accept",
                counter: "Counter-Offer",
                proposeChanges: "Propose Changes",
                generateContract: "Generate Contract",
                pay: "Pay",
                securely: "Securely",
                markComplete: "Mark Job as Complete",
                leaveReview: "Leave a Review",
            },
            system: {
                newOffer: "{name} has made a new offer of ${amount}.",
                agreementReached: "Agreement reached at ${amount}. The date has been reserved. Waiting for the talent to send the contract.",
                contractSent: "The talent has sent the contract. Please review and proceed with the secure payment.",
                paymentConfirmed: "Payment confirmed for ${finalPrice}. Funds are held securely. The talent will receive ${payout} after commission (${commission}).",
                jobCompleted: "The client has marked the job as complete. Funds have been released from escrow.",
                proposal: "--- CHANGE PROPOSAL ---"
            },
            notifications: {
                offerAccepted: "Offer accepted!",
                dateBooked: "Talent's calendar has been updated for the event date.",
                contractSent: "Contract sent to client.",
                insufficientBalance: "Insufficient balance to make payment.",
                paymentSuccess: "Payment successful! Funds are now in escrow."
            },
            emptyState: {
                title: "Select a Conversation",
                description: "Choose a conversation from the list to see the messages."
            }
        },
        dashboard: {
            welcome: "Welcome back",
            subtitle: "This is your command center. Manage everything from here.",
            notifications: {
                invalidAmount: "Please enter a valid amount.",
                topUpSuccess: "Successfully added ${amount} to your wallet."
            },
            wallet: {
                availableBalance: "Available Balance",
                topUpButton: "Top Up",
                withdrawButton: "Withdraw",
                escrowInfo: "${amount} held in escrow for ongoing jobs."
            },
            actions: {
                browseTalent: "Browse Talent",
                viewEvents: "View Events",
                editProfile: "Edit Profile",
                viewMessages: "View Messages",
                createEvent: "Create Event"
            },
            common: {
                conversations: {
                    title: "Recent Conversations",
                    empty: "No recent conversations."
                },
                finance: {
                    title: "Finances",
                    availableLabel: "Available for Withdrawal",
                    escrowLabel: "In Escrow",
                    withdrawButton: "Request Withdrawal"
                }
            },
            client: {
                upcoming: {
                    title: "My Upcoming Tickets",
                    empty: "You have no upcoming events."
                }
            },
            talent: {
                tabs: {
                    overview: "Overview",
                    availability: "Availability",
                    portfolio: "Portfolio",
                    services: "Services & Plans",
                    documents: "Documents"
                },
                availability: {
                    title: "Manage Availability",
                    subtitle: "Click on a date to mark it as booked/unavailable.",
                    daysOfWeek: "S,M,T,W,T,F,S"
                },
                plans: {
                    title: "Manage Service Plans",
                    subtitle: "Define the packages you offer to clients.",
                    createButton: "Create New Plan"
                },
                portfolio: {
                    title: "Manage Portfolio",
                    placeholder: "Enter new image URL...",
                    addButton: "Add Image"
                },
                documents: {
                    title: "Manage Documents",
                    subtitle: "Provide links to standard contracts or technical riders.",
                    contractLabel: "Standard Contract URL",
                    riderLabel: "Technical Rider URL",
                    saveButton: "Save Documents"
                },
                analytics: {
                    title: "Profile Analytics",
                    views: "Profile Views (30d)",
                    requests: "Booking Requests",
                    conversion: "Conversion Rate",
                    response: "Response Rate"
                }
            },
            venue: {
                myEvents: {
                    title: "My Events",
                    empty: "You haven't created any events yet.",
                    manageButton: "Manage"
                },
                performance: {
                    title: "Performance",
                    ticketsSold: "Total Tickets Sold",
                    totalRevenue: "Total Revenue",
                    activeEvents: "Active Events"
                }
            },
            modals: {
                topUp: {
                    title: "Top Up Wallet",
                    amountLabel: "Amount to add",
                    addButton: "Add Funds"
                },
                withdraw: {
                    titleTalent: "Request Payout",
                    titleClient: "Withdraw Funds",
                    availableTalent: "Available from payouts",
                    availableClient: "Available wallet balance",
                    amountLabel: "Amount to withdraw",
                    confirmButton: "Confirm Withdrawal"
                },
                editEvent: {
                    title: "Edit Event"
                },
                createEvent: {
                    title: "Create a New Event",
                    mapError: "Please select a location on the map.",
                    createButton: "Create Event"
                },
                eventForm: {
                    titleLabel: "Event Title",
                    dateLabel: "Date and Time",
                    locationLabel: "Location Name",
                    locationPlaceholder: "e.g., Soho House, Miami",
                    imageLabel: "Image URL",
                    imageLabelOptional: "Image URL (Optional)",
                    descriptionPlaceholder: "Describe your event...",
                    mapLabel: "Set Location on Map",
                    tiersTitle: "Ticket Tiers",
                    tierNamePlaceholder: "Tier Name (e.g., VIP)",
                    pricePlaceholder: "Price",
                    quantityPlaceholder: "Quantity",
                    addTierButton: "Add Another Tier"
                },
                editProfile: {
                    title: "Edit Your Profile",
                    bioLabel: "Bio",
                    tagsLabel: "Tags (comma-separated)",
                    rateLabel: "Hourly Rate ($)"
                },
                editPlan: {
                    title: "Edit Service Plan",
                    planTitleLabel: "Plan Title",
                    priceLabel: "Price",
                    descriptionLabel: "Description",
                    includesLabel: "What's Included (one per line)",
                    includesPlaceholder: "e.g., 4 hours of service\n150 edited photos",
                    addOnsTitle: "Add-ons",
                    addOnNamePlaceholder: "Add-on Name (e.g., Drone Footage)",
                    addOnDescPlaceholder: "Description",
                    addButton: "Add"
                }
            }
        },
        admin: {
            title: "Admin Dashboard",
            tabs: {
                users: "Users",
                talentCuration: "Talent Curation",
                talentManagement: "Talent Management",
                venueCuration: "Venue Curation",
                venueManagement: "Venue Management",
                finance: "Finance",
                settings: "Settings",
            },
            notifications: {
                settingsSaved: "Platform settings saved successfully."
            },
            users: {
                title: "User Management",
                table: {
                    user: "User",
                    role: "Role",
                    status: "Status",
                    actions: "Actions"
                },
                suspend: "Suspend",
                reactivate: "Re-activate"
            },
            talentCuration: {
                title: "Pending Talent Applications ({count})",
                approve: "Approve",
                reject: "Reject",
                empty: "No pending talent applications."
            },
            talentManagement: {
                title: "Active Talents",
                table: {
                    talent: "Talent",
                    status: "Status",
                    actions: "Actions"
                },
                certified: "Certified",
                makeCert: "Make Certified",
                removeCert: "Remove Certification"
            },
            venueCuration: {
                title: "Pending Venue Applications ({count})",
                approve: "Approve",
                reject: "Reject",
                empty: "No pending venue applications."
            },
            venueManagement: {
                title: "Active Venues",
                table: {
                    venue: "Venue",
                    badges: "Badges",
                    actions: "Actions"
                }
            },
            finance: {
                title: "Financial Overview",
                volume: "Total Transaction Volume",
                commissions: "Platform Commissions",
                escrow: "Funds in Escrow",
                recentVolume: "Recent Volume (7d)"
            },
            settings: {
                title: "Platform Settings",
                commissionLabel: "Standard Commission Rate",
                premierCommissionLabel: "Premier Talent Commission Rate",
                premierRequirementLabel: "Jobs to Reach Premier Tier",
                saveButton: "Save Settings"
            },
            modals: {
                editUser: {
                    title: "Edit User:",
                    nameLabel: "Name",
                    emailLabel: "Email"
                },
                confirm: {
                    title: "Confirm Action",
                    message: "Are you sure you want to {action} {name}?",
                    confirm: "Confirm"
                }
            }
        }
    },
    es: {
        locale: 'es-ES',
        common: {
            edit: "Editar",
            save: "Guardar",
            saveChanges: "Guardar Cambios",
            cancel: "Cancelar",
            delete: "Eliminar",
            add: "Añadir",
            remove: "Quitar",
        },
        navbar: {
            marketplace: "Marketplace",
            events: "Eventos",
            resale: "Reventa",
            messages: "Mensajes",
            dashboard: "Panel",
            admin: "Admin",
            wallet: "Billetera de Boletos",
            signOut: "Cerrar Sesión",
            signIn: "Iniciar Sesión",
            joinNow: "Únete Ahora"
        },
        home: {
            heroTitle: "Donde lo Excepcional se Une a la Oportunidad.",
            heroSubtitle: "Un marketplace exclusivo donde el mejor talento creativo del mundo conecta con clientes exigentes. Descubre, negocia y contrata con una confianza inigualable.",
            exploreButton: "Explorar Talentos",
            joinButton: "Únete al Elenco",
            feature1Title: "Un Elenco Curado de Élites.",
            feature1Desc: "Olvida el desplazamiento infinito. Cada profesional en Timeless es seleccionado a mano a través de un riguroso proceso de curación. Te conectamos solo con los mejores: verificados, experimentados y excepcionales.",
            feature2Title: "Negociación Fluida y Segura.",
            feature2Desc: "Nuestra plataforma integrada hace que la negociación sea transparente y directa. Todos los pagos están asegurados a través de nuestro sistema de depósito en garantía (escrow), retenidos hasta que el trabajo se complete a tu satisfacción. La confianza está incorporada.",
            feature3Title: "Tu Evento, Elevado.",
            feature3Desc: "Desde fiestas exclusivas hasta galas de alta moda, nuestra plataforma también es el hogar de eventos de primer nivel. Compra boletos, revende con facilidad y gestiona tu acceso todo en un solo lugar. Vive los eventos al estilo Timeless.",
            ctaTitle: "¿Listo para Experimentar lo Excepcional?",
            ctaSubtitle: "Ya sea que busques contratar al talento perfecto para tu evento, o seas un profesional listo para unirte a una red exclusiva, tu viaje comienza aquí.",
            ctaClientButton: "Soy Cliente o Venue",
            ctaTalentButton: "Soy Talento"
        },
        register: {
            step1: {
                title: "Únete a Timeless",
                subtitle: "Primero, dinos quién eres. Selecciona el perfil que mejor se adapte a ti.",
                clientTitle: "Soy Cliente",
                clientDesc: "Descubre y contrata profesionales excepcionales para tus eventos.",
                talentTitle: "Soy Talento",
                talentDesc: "Muestra tu trabajo a una clientela premium y consigue contrataciones.",
                venueTitle: "Soy Venue",
                venueDesc: "Publica tus eventos y conecta con nuestra comunidad exclusiva.",
            },
            step2: {
                title: "Crea Tu Cuenta",
                curationNotice: "Para mantener nuestro estándar de calidad, todos los nuevos perfiles son revisados por nuestro equipo de curación.",
                nameLabel: "Nombre Completo / Nombre de la Empresa",
                emailLabel: "Dirección de Correo Electrónico",
                passwordLabel: "Contraseña",
                categoryLabel: "Categoría Principal (ej. DJ, Fotógrafo)",
                cityLabel: "Ciudad (ej. Nueva York)",
                venueNameLabel: "Nombre del Venue",
                addressLabel: "Dirección del Venue",
                submitApplication: "Enviar Solicitud",
                createAccount: "Crear Cuenta"
            },
            step3: {
                title: "Solicitud Recibida",
                message: "Gracias por tu interés. Nuestro equipo de curación revisará tu solicitud y recibirás una notificación por correo electrónico en las próximas 48 horas.",
                button: "Volver al Inicio"
            },
            alreadyHaveAccount: "¿Ya tienes una cuenta?",
            signIn: "Iniciar Sesión"
        },
        marketplace: {
            title: "Descubre lo Excepcional",
            subtitle: "Explora nuestro elenco curado de talentos creativos de clase mundial.",
            collective: {
                viewing: "Viendo Colectivo",
            },
            filters: {
                title: "Filtrar Talentos",
                searchPlaceholder: "Buscar por nombre, etiqueta...",
                category: "Categoría",
                allCategories: "Todas las Categorías",
                city: "Ciudad",
                allCities: "Todas las Ciudades",
                resetButton: "Restablecer Filtros"
            },
            emptyState: {
                title: "No se Encontraron Talentos",
                description: "Intenta ajustar tus filtros de búsqueda para encontrar la opción perfecta para tu evento."
            }
        },
        messages: {
            title: "Conversaciones",
            noMessages: "Aún no hay mensajes.",
            placeholder: "Escribe tu mensaje...",
            send: "Enviar",
            clientOffer: "Oferta del Cliente",
            talentOffer: "Oferta del Talento",
            offerModal: {
                title: "Hacer una Contraoferta",
                label: "Monto de la Oferta",
                placeholder: "ej. 1500",
                cancel: "Cancelar",
                submit: "Enviar Oferta",
            },
            editBriefModal: {
                title: "Proponer Cambios al Brief",
                briefTitle: "Brief del Proyecto",
                eventTypeLabel: "Tipo de Evento",
                addOnsTitle: "Servicios Adicionales",
                submitButton: "Proponer Cambios"
            },
            proposal: {
                eventType: "Tipo de evento cambiado a",
                added: "Añadido",
                removed: "Eliminado",
            },
            status: {
                negotiating: { title: "En Negociación", desc: "Esperando acuerdo de ambas partes." },
                agreed: { title: "Acuerdo Alcanzado", desc: "Esperando que el talento genere el contrato." },
                contractSent: { title: "Contrato Enviado", desc: "Esperando el pago del cliente para asegurar la reserva." },
                paid: { title: "Pagado y Confirmado", desc: "Fondos asegurados en escrow hasta que se complete el trabajo." },
                completed: { title: "Trabajo Completado", desc: "Los fondos han sido liberados al talento." },
            },
            actions: {
                accept: "Aceptar",
                counter: "Contraofertar",
                proposeChanges: "Proponer Cambios",
                generateContract: "Generar Contrato",
                pay: "Pagar",
                securely: "de Forma Segura",
                markComplete: "Marcar como Completado",
                leaveReview: "Dejar una Reseña",
            },
            system: {
                newOffer: "{name} ha hecho una nueva oferta de ${amount}.",
                agreementReached: "Acuerdo alcanzado en ${amount}. La fecha ha sido reservada. Esperando que el talento envíe el contrato.",
                contractSent: "El talento ha enviado el contrato. Por favor, revísalo y procede con el pago seguro.",
                paymentConfirmed: "Pago confirmado por ${finalPrice}. Los fondos se retienen de forma segura. El talento recibirá ${payout} después de la comisión (${commission}).",
                jobCompleted: "El cliente ha marcado el trabajo como completado. Los fondos han sido liberados del depósito en garantía.",
                proposal: "--- PROPUESTA DE CAMBIO ---"
            },
            notifications: {
                offerAccepted: "¡Oferta aceptada!",
                dateBooked: "El calendario del talento ha sido actualizado para la fecha del evento.",
                contractSent: "Contrato enviado al cliente.",
                insufficientBalance: "Saldo insuficiente para realizar el pago.",
                paymentSuccess: "¡Pago exitoso! Los fondos están ahora en escrow."
            },
            emptyState: {
                title: "Selecciona una Conversación",
                description: "Elige una conversación de la lista para ver los mensajes."
            }
        },
        dashboard: {
            welcome: "Bienvenido de nuevo",
            subtitle: "Este es tu centro de mando. Gestiona todo desde aquí.",
            notifications: {
                invalidAmount: "Por favor, introduce una cantidad válida.",
                topUpSuccess: "Se han añadido ${amount} a tu billetera con éxito."
            },
            wallet: {
                availableBalance: "Saldo Disponible",
                topUpButton: "Recargar",
                withdrawButton: "Retirar",
                escrowInfo: "${amount} retenidos en escrow para trabajos en curso."
            },
            actions: {
                browseTalent: "Explorar Talentos",
                viewEvents: "Ver Eventos",
                editProfile: "Editar Perfil",
                viewMessages: "Ver Mensajes",
                createEvent: "Crear Evento"
            },
            common: {
                conversations: {
                    title: "Conversaciones Recientes",
                    empty: "No hay conversaciones recientes."
                },
                finance: {
                    title: "Finanzas",
                    availableLabel: "Disponible para Retiro",
                    escrowLabel: "En Escrow",
                    withdrawButton: "Solicitar Retiro"
                }
            },
            client: {
                upcoming: {
                    title: "Mis Próximos Boletos",
                    empty: "No tienes eventos próximos."
                }
            },
            talent: {
                tabs: {
                    overview: "Resumen",
                    availability: "Disponibilidad",
                    portfolio: "Portafolio",
                    services: "Servicios y Planes",
                    documents: "Documentos"
                },
                availability: {
                    title: "Gestionar Disponibilidad",
                    subtitle: "Haz clic en una fecha para marcarla como reservada/no disponible.",
                    daysOfWeek: "D,L,M,X,J,V,S"
                },
                plans: {
                    title: "Gestionar Planes de Servicio",
                    subtitle: "Define los paquetes que ofreces a los clientes.",
                    createButton: "Crear Nuevo Plan"
                },
                portfolio: {
                    title: "Gestionar Portafolio",
                    placeholder: "Introduce la URL de la nueva imagen...",
                    addButton: "Añadir Imagen"
                },
                documents: {
                    title: "Gestionar Documentos",
                    subtitle: "Proporciona enlaces a contratos estándar o riders técnicos.",
                    contractLabel: "URL del Contrato Estándar",
                    riderLabel: "URL del Rider Técnico",
                    saveButton: "Guardar Documentos"
                },
                analytics: {
                    title: "Análisis del Perfil",
                    views: "Vistas del Perfil (30d)",
                    requests: "Solicitudes de Reserva",
                    conversion: "Tasa de Conversión",
                    response: "Tasa de Respuesta"
                }
            },
            venue: {
                myEvents: {
                    title: "Mis Eventos",
                    empty: "Aún no has creado ningún evento.",
                    manageButton: "Gestionar"
                },
                performance: {
                    title: "Rendimiento",
                    ticketsSold: "Total de Boletos Vendidos",
                    totalRevenue: "Ingresos Totales",
                    activeEvents: "Eventos Activos"
                }
            },
            modals: {
                topUp: {
                    title: "Recargar Billetera",
                    amountLabel: "Cantidad a añadir",
                    addButton: "Añadir Fondos"
                },
                withdraw: {
                    titleTalent: "Solicitar Pago",
                    titleClient: "Retirar Fondos",
                    availableTalent: "Disponible de pagos",
                    availableClient: "Saldo disponible en la billetera",
                    amountLabel: "Cantidad a retirar",
                    confirmButton: "Confirmar Retiro"
                },
                editEvent: {
                    title: "Editar Evento"
                },
                createEvent: {
                    title: "Crear un Nuevo Evento",
                    mapError: "Por favor, selecciona una ubicación en el mapa.",
                    createButton: "Crear Evento"
                },
                eventForm: {
                    titleLabel: "Título del Evento",
                    dateLabel: "Fecha y Hora",
                    locationLabel: "Nombre del Lugar",
                    locationPlaceholder: "ej. Soho House, Miami",
                    imageLabel: "URL de la Imagen",
                    imageLabelOptional: "URL de la Imagen (Opcional)",
                    descriptionPlaceholder: "Describe tu evento...",
                    mapLabel: "Fijar Ubicación en el Mapa",
                    tiersTitle: "Niveles de Boletos",
                    tierNamePlaceholder: "Nombre (ej. VIP)",
                    pricePlaceholder: "Precio",
                    quantityPlaceholder: "Cantidad",
                    addTierButton: "Añadir Otro Nivel"
                },
                editProfile: {
                    title: "Editar Tu Perfil",
                    bioLabel: "Biografía",
                    tagsLabel: "Etiquetas (separadas por comas)",
                    rateLabel: "Tarifa por Hora ($)"
                },
                editPlan: {
                    title: "Editar Plan de Servicio",
                    planTitleLabel: "Título del Plan",
                    priceLabel: "Precio",
                    descriptionLabel: "Descripción",
                    includesLabel: "Qué incluye (uno por línea)",
                    includesPlaceholder: "ej. 4 horas de servicio\n150 fotos editadas",
                    addOnsTitle: "Servicios Adicionales",
                    addOnNamePlaceholder: "Nombre del Adicional (ej. Video con Dron)",
                    addOnDescPlaceholder: "Descripción",
                    addButton: "Añadir"
                }
            }
        },
        admin: {
            title: "Panel de Administración",
            tabs: {
                users: "Usuarios",
                talentCuration: "Curación de Talentos",
                talentManagement: "Gestión de Talentos",
                venueCuration: "Curación de Venues",
                venueManagement: "Gestión de Venues",
                finance: "Finanzas",
                settings: "Configuración",
            },
            notifications: {
                settingsSaved: "La configuración de la plataforma se ha guardado correctamente."
            },
            users: {
                title: "Gestión de Usuarios",
                table: {
                    user: "Usuario",
                    role: "Rol",
                    status: "Estado",
                    actions: "Acciones"
                },
                suspend: "Suspender",
                reactivate: "Reactivar"
            },
            talentCuration: {
                title: "Solicitudes de Talento Pendientes ({count})",
                approve: "Aprobar",
                reject: "Rechazar",
                empty: "No hay solicitudes de talento pendientes."
            },
            talentManagement: {
                title: "Talentos Activos",
                table: {
                    talent: "Talento",
                    status: "Estado",
                    actions: "Acciones"
                },
                certified: "Certificado",
                makeCert: "Hacer Certificado",
                removeCert: "Quitar Certificación"
            },
            venueCuration: {
                title: "Solicitudes de Venue Pendientes ({count})",
                approve: "Aprobar",
                reject: "Rechazar",
                empty: "No hay solicitudes de venue pendientes."
            },
            venueManagement: {
                title: "Venues Activos",
                table: {
                    venue: "Venue",
                    badges: "Insignias",
                    actions: "Acciones"
                }
            },
            finance: {
                title: "Resumen Financiero",
                volume: "Volumen Total de Transacciones",
                commissions: "Comisiones de la Plataforma",
                escrow: "Fondos en Escrow",
                recentVolume: "Volumen Reciente (7d)"
            },
            settings: {
                title: "Configuración de la Plataforma",
                commissionLabel: "Tasa de Comisión Estándar",
                premierCommissionLabel: "Tasa de Comisión para Talento Premier",
                premierRequirementLabel: "Trabajos para Alcanzar Nivel Premier",
                saveButton: "Guardar Configuración"
            },
            modals: {
                editUser: {
                    title: "Editar Usuario:",
                    nameLabel: "Nombre",
                    emailLabel: "Correo Electrónico"
                },
                confirm: {
                    title: "Confirmar Acción",
                    message: "¿Estás seguro de que quieres {action} a {name}?",
                    confirm: "Confirmar"
                }
            }
        }
    }
};
