#!/bin/sh

#===========================================
# USB Tethering Setup Script for OpenWrt
# Compatible with Samsung S24 and Android devices
#===========================================

echo "=========================================="
echo "   USB Tethering Setup for OpenWrt"
echo "=========================================="

echo "[1/5] Updating package lists..."
opkg update || echo "WARNING: Failed to update packages, continuing anyway..."

echo "[2/5] Installing core USB tethering packages..."
opkg install kmod-usb-net-rndis || echo "WARNING: kmod-usb-net-rndis failed"
opkg install kmod-usb-net-cdc-ether || echo "WARNING: kmod-usb-net-cdc-ether failed"
opkg install kmod-nls-base || echo "WARNING: kmod-nls-base failed"
opkg install kmod-usb-net || echo "WARNING: kmod-usb-net failed"

echo "[3/5] Installing additional packages..."
opkg install kmod-usb-net-cdc-ncm || echo "WARNING: kmod-usb-net-cdc-ncm failed"
opkg install usbutils || echo "WARNING: usbutils failed"

echo "[4/5] Configuring network interface..."
uci set network.wwan=interface || echo "WARNING: Failed to create wwan interface"
uci set network.wwan.proto='dhcp' || echo "WARNING: Failed to set proto"
uci set network.wwan.device='usb0' || echo "WARNING: Failed to set device"
uci commit network || echo "WARNING: Failed to commit network"

echo "[5/5] Configuring firewall..."
uci add_list firewall.@zone[1].network='wwan' || echo "WARNING: Failed to add wwan to firewall"
uci commit firewall || echo "WARNING: Failed to commit firewall"

echo "Restarting services..."
/etc/init. d/network restart || echo "WARNING: Failed to restart network"
/etc/init. d/firewall restart || echo "WARNING: Failed to restart firewall"

echo "=========================================="
echo "   Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Connect your Samsung S24 via USB"
echo "2. Enable USB Tethering on your phone"
echo "3. Check connection: ping google.com"
echo ""
echo "=========================================="
