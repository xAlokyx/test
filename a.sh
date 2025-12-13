#!/bin/sh

wget -O passwall.pub https://master.dl.sourceforge.net/project/openwrt-passwall-build/passwall.pub
opkg-key add passwall. pub

read release arch << EOF
$(. /etc/openwrt_release ; echo ${DISTRIB_RELEASE%.*} $DISTRIB_ARCH)
EOF

for feed in passwall_luci passwall_packages passwall2; do
    echo "src/gz $feed https://master.dl.sourceforge.net/project/openwrt-passwall-build/releases/packages-$release/$arch/$feed" >> /etc/opkg/customfeeds.conf
done

opkg update

opkg remove dnsmasq

opkg install dnsmasq-full

opkg install luci-app-passwall

opkg install xray-core
