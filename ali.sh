#!/bin/sh

#===========================================
# USB Tethering Setup Script for OpenWrt
# Compatible with Samsung S24 and Android devices
#===========================================

echo "=========================================="
echo "   USB Tethering Setup for OpenWrt"
echo "=========================================="

echo "[1/5] Updating package lists..."
opkg update

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to update packages!"
    exit 1
fi

echo "[2/5] Installing core USB tethering packages..."
opkg install kmod-usb-net-rndis \
             kmod-usb-net-cdc-ether \
             kmod-nls-base \
             kmod-usb-net

echo "[3/5] Installing additional packages..."
opkg install kmod-usb-net-cdc-ncm \
             usbutils

echo "[4/5] Configuring network interface..."
uci set network.wwan=interface
uci set network.wwan.proto='dhcp'
uci set network.wwan.device='usb0'
uci commit network

echo "[5/5] Configuring firewall..."
uci add_list firewall.@zone[1].network='wwan'
uci commit firewall

echo "Restarting services..."
/etc/init.d/network restart
/etc/init.d/firewall restart

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
