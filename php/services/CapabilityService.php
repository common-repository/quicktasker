<?php

namespace WPQT\Capability;

class CapabilityService {

      /**
     * Adds QuickTasker admin capabilities to the administrator role.
     *
     * This function checks if the administrator role has the QuickTasker admin capabilities
     * defined by WP_QUICKTASKER_ADMIN_ROLE and WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE.
     * If the capabilities are not present, they are added to the administrator role.
     *
     * @return void
     */
    public function addQuickTaskerAdminCapabilityToAdminRole() {
        $adminRole = get_role('administrator');

        if ( !$adminRole->has_cap(WP_QUICKTASKER_ADMIN_ROLE) ) {
            $adminRole->add_cap(WP_QUICKTASKER_ADMIN_ROLE);
        }

        if ( !$adminRole->has_cap(WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE) ) {
            $adminRole->add_cap(WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE);
        }
    }

    /**
     * Removes QuickTasker admin capabilities from the administrator role.
     *
     * This function checks if the administrator role has the QuickTasker admin capabilities
     * defined by WP_QUICKTASKER_ADMIN_ROLE and WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE.
     * If the capabilities are present, they are removed from the administrator role.
     *
     * @return void
     */
    public function removeQuickTaskerAdminCapabilityFromAdminRole() {
        $adminRole = get_role('administrator');

        if ( $adminRole->has_cap(WP_QUICKTASKER_ADMIN_ROLE) ) {
            $adminRole->remove_cap(WP_QUICKTASKER_ADMIN_ROLE);
        }

        if ( $adminRole->has_cap(WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE) ) {
            $adminRole->remove_cap(WP_QUICKTASKER_ADMIN_ROLE_ALLOW_DELETE);
        }
    }
}