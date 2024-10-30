import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getAbility } from "@/lib/permit";

export default function PermitWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    useEffect(() => {
        const loadPermissions = async () => {
            if (!isLoaded || !user?.id) return;

            console.log('Loading permissions for user:', user.id);
            await getAbility(user.id);
            console.log('Permissions loaded');
            setPermissionsLoaded(true);
        };

        loadPermissions();
    }, [isLoaded, user]);

    console.log('PermitWrapper state:', { isLoaded, userId: user?.id, permissionsLoaded });

    if (!isLoaded || !permissionsLoaded) {
        console.log('Still loading...');
        return <div>Loading permissions...</div>;
    }

    return <>{children}</>;
}