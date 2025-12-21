#!/bin/sh v2ray
clear
wget -q https://downloads.sourceforge.net/project/v2raya/openwrt/v2raya.pub -O /etc/opkg/keys/94cc2a834fb0aa03 2>&1

echo "src/gz v2raya https://downloads.sourceforge.net/project/v2raya/openwrt/$(. /etc/openwrt_release && echo \"$DISTRIB_ARCH\")" >> /etc/opkg/customfeeds.conf 2>/dev/null

opkg update >/dev/null 2>&1
opkg install v2raya >/dev/null 2>&1
opkg install kmod-nft-tproxy >/dev/null 2>&1
opkg install xray-core >/dev/null 2>&1
opkg install v2fly-geoip v2fly-geosite >/dev/null 2>&1
opkg install luci-app-v2raya >/dev/null 2>&1
uci set v2raya.config.enabled='1' >/dev/null 2>&1
uci commit v2raya >/dev/null 2>&1
/etc/init.d/v2raya start >/dev/null 2>&1

mkdir -p /usr/share/nftables.d/chain-pre/mangle_postrouting/ >/dev/null 2>&1

echo "ip ttl set 65" > /usr/share/nftables.d/chain-pre/mangle_postrouting/01-set-ttl.nft 2>/dev/null

fw4 reload >/dev/null 2>&1

rm -- "$0" >/dev/null 2>&1

echo -e "\033[0;32m powered by Aloky \033[0m"
